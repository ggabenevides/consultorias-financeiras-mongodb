# Como contribuir

Guia rápido para a equipe trabalhar no repo sem pisar no trabalho dos outros. Instalação, donos dos arquivos e formato das consultas estão no [README](README.md).

## Fluxo de trabalho

1. **Atualize a `main` e crie a sua branch:**
   ```bash
   git checkout main
   git pull
   git checkout -b seunome/o-que-vai-fazer    # ex.: clara/agregacoes
   ```
2. **Rode o projeto inteiro** para garantir que seu banco local está igual ao dos outros:
   ```bash
   mongosh projeto.js
   ```
3. **Edite só o seu arquivo** em `scripts/` (veja a tabela de donos no README).
4. **Teste o seu arquivo** (setup -> povoamento -> seu arquivo) até rodar sem erro.
5. **Rode o projeto inteiro de novo** antes do push.
6. **Commit e push da branch:**
   ```bash
   git add scripts/seu_arquivo.js
   git commit -m "consultas: adiciona 5.3.1 a 5.3.4 (group, sum, avg)"
   git push -u origin seunome/o-que-vai-fazer
   ```
7. **Abra um Pull Request para a `main`** no GitHub, preenchendo o modelo (seção abaixo). Marque como revisor a pessoa da tabela de revisão cruzada.
8. **Depois da aprovação**, faça o merge e apague a branch.

Ninguém dá push direto na `main`. Como cada pessoa tem o próprio arquivo, conflitos devem ser raros, e o PR garante que alguém além do dono olhou cada consulta.

## Mensagens de commit

Formato: `tipo: o que mudou`, em português, no presente.

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `dados` | mudou o povoamento | `dados: adiciona 3 clientes sem consultor` |
| `modelo` | mudou o `modelo_dados.md` | `modelo: adiciona campo email em consultores` |
| `consultas` | adicionou ou alterou consultas | `consultas: adiciona 5.2.1 a 5.2.3 (gte, exists, all)` |
| `fix` | corrigiu algo quebrado | `fix: corrige nome do campo em 5.3.2` |
| `docs` | README, CONTRIBUTING, prints | `docs: adiciona prints das agregações` |

## Checklist antes do push

(É o mesmo checklist do modelo de PR.)

- [ ] `mongosh projeto.js` roda do início ao fim sem erro
- [ ] Mexi só no meu arquivo (ou combinei com o dono no grupo)
- [ ] Toda consulta tem o cabeçalho com número, itens da checklist e pergunta
- [ ] Toda consulta devolve resultado (nenhuma volta vazia)
- [ ] Usei os nomes de campos exatamente como no `docs/modelo_dados.md`
- [ ] Nenhum `update`, `delete` ou `rename` fora dos arquivos 07 e 08

## Pull Requests

- **Título:** igual ao formato de commit, ex.: `consultas: agregações 5.3.1 a 5.3.7`.
- **Tamanho:** um PR por bloco de trabalho. Não espere terminar tudo para abrir: PRs pequenos são revisados mais rápido.
- **Revisor:** quem está na tabela de revisão cruzada. PRs do povoamento (Matheus) e do modelo também passam pela Gabriela.
- **Prazo de revisão:** até o fim do dia em que o PR foi aberto. Se o revisor não puder, avise no grupo.
- **Aprovação:** 1 aprovação basta para o merge.

O GitHub preenche o corpo do PR automaticamente com o modelo em `.github/pull_request_template.md`:

```markdown
## O que este PR faz

<!-- Uma ou duas frases. Ex.: adiciona as consultas de agregação 5.3.1 a 5.3.7. -->

## Arquivos alterados

- [ ] `scripts/...`

## Itens da checklist cobertos

<!-- Liste número e nome. Ex.: 8 GROUP, 9 SUM, 12 AVG -->

| Consulta | Itens | Pergunta |
| --- | --- | --- |
| 5.3.1 | | |

## Mudanças em dados ou modelo

- [ ] Não mexe em dados nem no modelo
- [ ] Altera o `01_povoamento.js` (explique o que e por quê)
- [ ] Altera o `docs/modelo_dados.md` (avisei no grupo)

## Como testar

1. `git checkout <branch>`
2. `mongosh projeto.js`
3. Conferir a saída das consultas acima

## Checklist

- [ ] `mongosh projeto.js` roda do início ao fim sem erro
- [ ] Mexi só no meu arquivo (ou combinei com o dono)
- [ ] Toda consulta tem cabeçalho com número, itens e pergunta
- [ ] Nenhuma consulta volta vazia
- [ ] Nomes de campos iguais aos do `docs/modelo_dados.md`
- [ ] Nenhum `update`, `delete` ou `rename` fora dos arquivos 07 e 08
- [ ] Prints salvos em `docs/prints/` (se já estiver na fase de relatório)

## Observações para quem revisa

<!-- Dúvidas, partes que você não tem certeza, algo que quer que olhem com atenção. -->
```

## Precisa de um dado que não existe?

Se a sua consulta volta vazia porque falta um tipo de dado no povoamento (por exemplo, nenhum cliente com 3 objetivos):

1. **Não altere o banco à mão** nem crie dados no seu arquivo.
2. Avise o **Matheus** no grupo, dizendo qual consulta precisa de qual dado.
3. Ele ajusta o `01_povoamento.js` e avisa quando subir.
4. Dê `git pull` e rode o `projeto.js` de novo.

Se a mudança for num **campo** (nome, tipo, campo novo), fale com a **Gabriela** antes: o `modelo_dados.md` precisa mudar junto.

## Se der conflito no git

Acontece se duas pessoas mexerem no mesmo arquivo.

1. Abra o arquivo no VS Code: ele mostra as duas versões lado a lado.
2. Escolha **Accept Both Changes** se as duas partes devem ficar, ou combine com a outra pessoa.
3. Rode `mongosh projeto.js` para conferir que nada quebrou.
4. `git add`, `git commit` e `git push`.

Para trazer mudanças novas da `main` para a sua branch: `git checkout main && git pull && git checkout sua-branch && git merge main`.

Na dúvida, pare e pergunte no grupo antes de dar push.

## Prints para o relatório

- Tire os prints no terminal interativo (`mongosh`) ou no Playground do VS Code, onde o resultado aparece formatado.
- Salve em `docs/prints/` com o número da consulta: `5.3.2.png`, `6.1.png`.
- Mostre o comando **e** a saída no mesmo print sempre que couber. Para updates, um print do antes e outro do depois.

## Revisão cruzada (domingo, 29/11)

Cada pessoa revisa o arquivo de outra:

| Quem revisa | Revisa o arquivo de |
| --- | --- |
| Marcela | Clara (`04`) |
| Clara | Miguel (`05`) |
| Miguel | Arthur (`06`, `07`, `08`) |
| Arthur | Marcela (`03`) |
| Matheus | Gabriela (texto do relatório) |
| Gabriela | Matheus (`01`, `02`) e a tabela de cobertura |

O que conferir:

- A consulta responde a pergunta escrita no cabeçalho?
- Os itens da checklist marcados aparecem mesmo no comando?
- Você consegue explicar a consulta em voz alta? Se não, peça para o dono explicar: qualquer um pode ser chamado para apresentar.

Os comentários vão no próprio PR (código) ou no documento do relatório (texto). O dono corrige, dá push na mesma branch e avisa o revisor.

A revisão cruzada de domingo é uma passada final no projeto inteiro; os PRs ao longo da semana já são revisados pelas mesmas duplas.