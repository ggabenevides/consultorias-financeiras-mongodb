# Modelo de dados — Consultorias financeiras, clientes e investimentos

Banco: `consultoria_financeira` - 4 coleções 

> Este documento é a fonte da verdade para o `01_povoamento.js` e para todas as consultas.
> Toda mudança nesse documento implica atualização do povoamento e comunicação pra a equipe

## Visão geral

```
consultorias 1 ──── N consultores 1 ──── N clientes 1 ──── N investimentos
   (CTR001)            (CON001)            (CLI001)            (INV0001)
```

- Uma **consultoria** tem vários consultores.
- Um **consultor** trabalha em uma consultoria e atende vários clientes.
- Um **cliente** pode ter um consultor (ou nenhum) e tem vários investimentos.
- Um **investimento** pertence a um cliente e guarda dentro dele o histórico de aportes.

### Referência ou embutido?

| Relação | Escolha | Por quê |
| --- | --- | --- |
| consultor -> consultoria | referência (`consultoria_id`) | consultoria é consultada sozinha e muda pouco; evita repetir dados em cada consultor |
| cliente -> consultor | referência (`consultor_id`) | um consultor atende vários clientes; o cliente pode ficar sem consultor |
| investimento -> cliente | referência (`cliente_id`) | carteiras crescem sem limite; investimentos são consultados e agregados sozinhos |
| endereço do cliente | embutido (`endereco`) | só existe junto do cliente e é sempre lido com ele |
| aportes do investimento | embutido (array `aportes`) | pertencem só àquele investimento, são poucos e são lidos junto |
| objetivos, certificações, especialidades | embutido (arrays de strings) | listas curtas de valores simples |

### Carga de trabalho da aplicação

Seguindo o primeiro passo do processo de design de esquema do MongoDB (*Identify Application Workload*): as operações mais frequentes guiam o modelo e os índices. Frequências estimadas para uma plataforma de médio porte.

| Ação | Tipo | Campos envolvidos | Frequência | Prioridade | O que isso decide no modelo |
| --- | --- | --- | --- | --- | --- |
| Cliente consulta a própria carteira | Leitura | `investimentos`: `cliente_id`, `tipo`, `valor_atual`, `rentabilidade_anual` | 5.000 / dia | Alta | Lê uma coleção só, sem `$lookup`; pede índice em `investimentos.cliente_id` |
| Registrar novo aporte | Escrita | `aportes`, `valor_aplicado`, `valor_atual` | 300 / dia | Alta | Aportes embutidos: um único `updateOne` com `$push` + `$inc`, atômico |
| Consultor lista seus clientes | Leitura | `clientes`: `consultor_id`, `nome`, `perfil_risco`, `objetivos` | 500 / dia | Alta | Pede índice em `clientes.consultor_id`; objetivos já vêm no documento |
| Buscar consultoria por tema | Leitura | `consultorias`: `descricao`, `especialidades` | 200 / dia | Média | Índice de texto em `descricao` |
| Cadastrar cliente | Escrita | todos os campos de `clientes` | 20 / dia | Média | Endereço embutido: um único `insertOne` |
| Relatório da consultoria (total sob gestão por tipo) | Leitura (agregação) | `investimentos` -> `clientes` -> `consultores` | 10 / dia | Média | Exige 2 `$lookup`; aceitável por ser raro |
| Atualizar perfil de risco ou certificação | Escrita | `perfil_risco`, `certificacoes` | 5 / dia | Baixa | `$set` e `$addToSet` simples |

Leitura da tabela: as operações frequentes leem uma coleção só, e os `$lookup` ficaram nas operações raras (relatórios). Se o relatório da consultoria ficasse frequente, a alternativa seria repetir `consultoria_id` dentro de `investimentos` (desnormalização), trocando consistência por velocidade.

## Convenções

- Nomes de campos em `snake_case`, sem acento.
- Ids em string legível: `CTR001`, `CON001`, `CLI001`, `INV0001` (facilita `$lookup` e testes).
- Datas sempre como `ISODate("AAAA-MM-DD")`, nunca string.
- Valores em reais como número (`20000`, `21340.5`), sem "R$" e sem string.
- Percentuais como número: `11.2` significa 11,2% ao ano.
- CNPJ e demais dados pessoais são **fictícios**.

---

## Coleções
### 1. `consultorias` — 4 documentos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `_id` | string | sim | `CTR001` a `CTR004` |
| `nome` | string | sim | nome fantasia |
| `cnpj` | string | sim | fictício, formato `00.000.000/0001-00` |
| `cidade` | string | sim | |
| `uf` | string | sim | sigla com 2 letras |
| `ano_fundacao` | int | sim | ex.: `2012` |
| `especialidades` | array de string | sim | 2 a 4 valores da lista abaixo |
| `descricao` | string | sim | 1 a 2 frases; **tem índice de texto** |

Valores de `especialidades`: `previdência`, `renda fixa`, `renda variável`, `planejamento sucessório`, `investimentos internacionais`, `planejamento tributário`.

```javascript
{
  _id: "CTR001",
  nome: "Horizonte Investimentos",
  cnpj: "12.345.678/0001-90",
  cidade: "Recife",
  uf: "PE",
  ano_fundacao: 2012,
  especialidades: ["previdência", "renda fixa", "planejamento sucessório"],
  descricao: "Consultoria focada em planejamento de aposentadoria e previdência privada para profissionais liberais."
}
```

### 2. `consultores` — 10 documentos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `_id` | string | sim | `CON001` a `CON010` |
| `nome` | string | sim | |
| `email` | string | sim | fictício |
| `consultoria_id` | string | sim | referência a `consultorias._id` |
| `anos_experiencia` | int | sim | 1 a 25 |
| `taxa_hora` | number | sim | valor da hora em reais, 150 a 600 |
| `certificacoes` | array de string | sim | 1 a 3 valores da lista abaixo |

Valores de `certificacoes`: `CPA-10`, `CPA-20`, `CEA`, `CFP`, `CNPI`.

```javascript
{
  _id: "CON001",
  nome: "Rafael Menezes",
  email: "rafael.menezes@horizonte.com",
  consultoria_id: "CTR001",
  anos_experiencia: 8,
  taxa_hora: 320,
  certificacoes: ["CPA-20", "CEA"]
}
```

### 3. `clientes` — 30 documentos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `_id` | string | sim | `CLI001` a `CLI030` |
| `nome` | string | sim | |
| `idade` | int | sim | 20 a 75 |
| `renda_mensal` | number | sim | 2.000 a 60.000 |
| `perfil_risco` | string | sim | `conservador`, `moderado` ou `arrojado` |
| `consultor_id` | string | **não** | referência a `consultores._id`; **ausente** em alguns clientes |
| `objetivos` | array de string | sim | 1 a 4 valores da lista abaixo |
| `endereco` | objeto `{ cidade, uf }` | sim | embutido |
| `data_cadastro` | date | sim | entre 2022 e 2026 |

Valores de `objetivos`: `aposentadoria`, `reserva de emergência`, `imóvel`, `educação dos filhos`, `viagem`, `independência financeira`.

```javascript
{
  _id: "CLI001",
  nome: "Marina Albuquerque",
  idade: 34,
  renda_mensal: 12500,
  perfil_risco: "moderado",
  consultor_id: "CON001",
  objetivos: ["aposentadoria", "reserva de emergência", "imóvel"],
  endereco: { cidade: "Recife", uf: "PE" },
  data_cadastro: ISODate("2025-03-10")
}
```

Atenção: cliente sem consultor **não tem o campo** `consultor_id` (não usar `null` nem string vazia), senão o `$exists` não funciona como esperado.

### 4. `investimentos` — 60 documentos

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `_id` | string | sim | `INV0001` a `INV0060` |
| `cliente_id` | string | sim | referência a `clientes._id` |
| `tipo` | string | sim | valor da tabela abaixo |
| `emissor` | string | sim | banco ou gestora fictícia (`Banco Alfa`, `Tesouro Nacional`...) |
| `valor_aplicado` | number | sim | **igual à soma dos `aportes`** |
| `valor_atual` | number | sim | valor hoje; pode ser menor que o aplicado |
| `rentabilidade_anual` | number | sim | em %, pode ser negativa em ações e FII |
| `risco` | string | sim | segue o `tipo` (tabela abaixo) |
| `liquidez_dias` | int | sim | dias para resgatar |
| `data_aplicacao` | date | sim | data do primeiro aporte |
| `aportes` | array de `{ data, valor }` | sim | 1 a 3 aportes |

Tipos, risco e liquidez de referência:

| `tipo` | `risco` | `liquidez_dias` | `rentabilidade_anual` típica |
| --- | --- | --- | --- |
| `Tesouro Selic` | `baixo` | 1 | 10 a 11,5 |
| `CDB` | `baixo` | 0 a 720 | 10 a 13 |
| `LCI` | `baixo` | 90 a 365 | 9 a 11 |
| `Multimercado` | `médio` | 30 | 5 a 15 |
| `FII` | `médio` | 2 | −5 a 14 |
| `Ações` | `alto` | 2 | −20 a 30 |

```javascript
{
  _id: "INV0001",
  cliente_id: "CLI001",
  tipo: "CDB",
  emissor: "Banco Alfa",
  valor_aplicado: 20000,
  valor_atual: 21340.5,
  rentabilidade_anual: 11.2,
  risco: "baixo",
  liquidez_dias: 0,
  data_aplicacao: ISODate("2025-06-01"),
  aportes: [
    { data: ISODate("2025-06-01"), valor: 15000 },
    { data: ISODate("2025-09-01"), valor: 5000 }
  ]
}
```

---

## Distribuição dos dados

- Cada consultoria tem 2 ou 3 consultores (total 10).
- Cada consultor atende de 2 a 4 clientes; **3 clientes ficam sem consultor**.
- Cada cliente tem de 1 a 4 investimentos (total 60); todo cliente tem pelo menos 1.
- Perfil de risco coerente com a carteira na maioria dos casos (conservador -> mais renda fixa; arrojado -> mais ações e FII).

## Variedade obrigatória (para as consultas não voltarem vazias)

| Requisito nos dados | Para qual item da checklist | Mínimo |
| --- | --- | --- |
| Clientes **sem** o campo `consultor_id` | 13 EXISTS | 3 clientes |
| Clientes com exatamente 3 objetivos | 3 SIZE | 5 clientes |
| Clientes com `aposentadoria` **e** `reserva de emergência` | 19 ALL | 4 clientes |
| Clientes com renda ≥ 10.000 | 7 GTE | 8 clientes |
| Clientes dos três perfis de risco | 8 GROUP, 10 COUNTDOCUMENTS | pelo menos 6 de cada |
| Clientes de PE e de outros estados | 5 MATCH | ~60% PE, resto em 3+ estados |
| Investimentos com `valor_atual < valor_aplicado` | 16 EXPR, 27 COND | 8 investimentos |
| Investimentos de todos os 6 tipos | 8 GROUP, 12 AVG, 11 MAX | 5 de cada tipo |
| Aportes de valores variados (abaixo e acima de 5.000) | 23 FILTER | 15 investimentos com 2+ aportes |
| Descrições com "previdência" e "planejamento" | 21 TEXT, 22 SEARCH | 2 consultorias cada |
| Consultores com certificações repetidas e diferentes | 30 ADDTOSET | variado |
| Valores altos e baixos de aplicação (abaixo e acima de 50.000) | 17 FUNCTION | variado |

## Regras de integridade (conferir no fim do povoamento)

- Todo `consultoria_id`, `consultor_id` e `cliente_id` aponta para um `_id` que existe.
- `valor_aplicado` = soma de `aportes.valor` em todo investimento.
- `data_aplicacao` = data do primeiro aporte.
- `risco` bate com o `tipo` segundo a tabela acima.
- `countDocuments()` de cada coleção = 4 / 10 / 30 / 60.
