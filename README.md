# Consultorias financeiras, clientes e investimentos

Projeto NoSQL de Gerenciamento de Dados e Informação (IF685, CIn-UFPE, 2026.2): modelagem e consultas em MongoDB para uma plataforma de consultorias financeiras, seus consultores, clientes e carteiras de investimento.

- Modelo de dados (fonte da verdade): [`docs/modelo_dados.md`](docs/modelo_dados.md)
- Entrega: documento no Classroom até **30/11**

## 1. Subir o MongoDB local

Cada pessoa roda o banco no próprio computador. Escolha **uma** opção:

**Docker** (recomendado se você já tem Docker):

```bash
docker run -d --name consultoria_financeira -p 27017:27017 mongo
```

Nos próximos dias, para ligar de novo: `docker start consultoria_financeira`.

**Instalação direta:** baixe o [MongoDB Community Server](https://www.mongodb.com/try/download/community) e o [mongosh](https://www.mongodb.com/try/download/shell). No Windows, marque a opção de instalar como serviço.

Teste: rode `mongosh` no terminal e depois `db.version()`. Se aparecer um número de versão, está pronto.

**VS Code:** instale a extensão **MongoDB for VS Code** e conecte em `mongodb://localhost:27017`.

## 2. Rodar o projeto

Na raiz do repo:

```bash
mongosh projeto.js
```

O `projeto.js` apaga o banco `consultoria_financeira`, recria tudo e roda as consultas na ordem. No fim, mostra quantos documentos ficaram em cada coleção. Pode rodar quantas vezes quiser.

Para testar só o seu arquivo, rode antes o setup e o povoamento:

```bash
mongosh scripts/00_setup.js
mongosh scripts/01_povoamento.js
mongosh scripts/03_selecao_filtros.js   # troque pelo seu arquivo
```

Também dá para abrir o seu arquivo num **Playground** do VS Code e rodar com ▶ (o banco precisa estar povoado).

## 3. Quem é dono de quê

| Arquivo | Dono | Itens da checklist |
| --- | --- | --- |
| `00_setup.js`, `projeto.js`, `docs/` | Gabriela | — |
| `01_povoamento.js` | Matheus | 1 USE, 25 INSERTONE |
| `02_indices.js` | Matheus | prepara 21 TEXT |
| `03_selecao_filtros.js` | Marcela | 2 FIND, 3 SIZE, 7 GTE, 10 COUNTDOCUMENTS, 13 EXISTS, 14 SORT, 15 LIMIT, 18 PRETTY, 19 ALL, 29 FINDONE |
| `04_agregacoes.js` | Clara | 4 AGGREGATE, 5 MATCH, 6 PROJECT, 8 GROUP, 9 SUM, 11 MAX, 12 AVG |
| `05_juncoes_expressoes.js` | Miguel | 16 EXPR, 17 FUNCTION, 23 FILTER, 27 COND, 28 LOOKUP |
| `06_busca_textual.js` | Arthur | 21 TEXT, 22 SEARCH |
| `07_atualizacao.js` | Arthur | 20 SET, 24 UPDATEONE/UPDATEMANY, 30 ADDTOSET |
| `08_remocao_manutencao.js` | Arthur | 26 RENAMECOLLECTION + deleteOne/deleteMany |

## 4. Regras da equipe

1. **Cada um mexe só no próprio arquivo.** Se você precisa de algo no arquivo de outra pessoa, fala com ela no grupo.
2. **Mudou um dado, mudou o `01_povoamento.js`.** Nunca altere dados à mão no seu banco local, senão os resultados param de bater com os dos outros.
3. **Mudou um campo, mudou o `docs/modelo_dados.md`**, e avisa no grupo.
4. **Antes de dar push, rode `mongosh projeto.js` inteiro** e confira se termina sem erro.
5. **Updates, deletes e rename ficam só nos arquivos 07 e 08**, para não quebrar as consultas dos outros.

## 5. Formato de cada consulta

Toda consulta segue este modelo; o cabeçalho vira o texto do relatório.

```javascript
// Consulta 5.3.2 — Itens: 8 GROUP, 9 SUM, 14 SORT
// Pergunta: qual o total aplicado por tipo de investimento, do maior para o menor?
printjson(
  db.investimentos.aggregate([
    { $group: { _id: "$tipo", total_aplicado: { $sum: "$valor_aplicado" } } },
    { $sort: { total_aplicado: -1 } }
  ]).toArray()
);
```

Dentro de um script rodado com `mongosh arquivo.js`, o resultado **não aparece sozinho**: use `printjson(...)` com `.toArray()`. No terminal interativo e no Playground do VS Code, o resultado aparece direto, e é de lá que saem os prints para o relatório (salve em `docs/prints/`).

Numeração das consultas, igual aos tópicos do relatório:

- 4.x — inserção
- 5.1.x — seleção e projeção
- 5.2.x — filtros
- 5.3.x — funções de agregação
- 5.4.x — busca textual
- 6.x — atualização e remoção
