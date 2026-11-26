// projeto.js - roda o projeto inteiro do zero, na ordem certa
// uso (na raiz do repo):  mongosh projeto.js

const scripts = [
  "00_setup.js",
  "01_povoamento.js",
  "02_indices.js",
  "03_selecao_filtros.js",
  "04_agregacoes.js",
  "05_juncoes_expressoes.js",
  "06_busca_textual.js",
  "07_atualizacao.js",
  "08_remocao_manutencao.js",
];

for (const arquivo of scripts) {
  print(`\n===== ${arquivo} =====`);
  load(`scripts/${arquivo}`);
}

db = db.getSiblingDB("consultoria_financeira");
print("\n===== Contagem final =====");
db.getCollectionNames().sort().forEach((colecao) => {
  print(`  ${colecao}: ${db.getCollection(colecao).countDocuments()} documentos`);
});
print("\nProjeto executado sem erros.");
