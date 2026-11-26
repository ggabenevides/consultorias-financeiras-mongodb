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