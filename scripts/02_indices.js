// 02_indices.js - responsável: matheus
// itens da checklist: -- (prepara 21 TEXT)
// criação do índice de texto em consultorias.descricao e índices de apoio

db = db.getSiblingDB("consultoria_financeira");

db.consultorias.createIndex(
  { descricao: "text" },
  { default_language: "portuguese" }
);

db.clientes.createIndex({ consultor_id: 1 });
db.investimentos.createIndex({ cliente_id: 1 });

print("Índices criados com sucesso.");