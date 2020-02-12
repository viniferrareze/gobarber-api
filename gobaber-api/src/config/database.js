require('dotenv/config');

module.exports = {
   dialect: 'postgres',
   host: process.env.DB_HOST,
   username: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   define: {
      timestamps: true, // armazena a data de criação/edição de cada registro
      underscored: true, // garante padronização de tabela e colunas
      underscoredAll: true,
   },
};
