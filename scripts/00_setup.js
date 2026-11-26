// 00_setup.js - responsável: gabi
// seleciona o banco e apaga tudo o que existir nele, para o projeto rodar sempre do zero (sem erro de _id duplicado ao rodar de novo).
// no relatório, a seleção do banco aparece como:  use consultoria_financeira
// usandos getSiblingDB porque é o jeito garantido de trocar de banco dentro de um script carregado com load()

db = db.getSiblingDB("consultoria_financeira");
db.dropDatabase();

print("Banco consultoria_financeira limpo e selecionado.");
