module.exports = {
   dialect: 'postgres',
   host: 'localhost',
   username: 'postgres',
   password: 'docker',
   database: 'gobarber',
   define: {
      timestamps: true, //armazena a data de criação/edição de cada registro
      underscored: true, //garante padronização de tabela e colunas
      underscoredAll: true,
   }
};