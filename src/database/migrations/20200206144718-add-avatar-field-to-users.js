module.exports = {
   up: (queryInterface, Sequelize) => {
      // adicionando uma nova coluna na tabela users, chamada avatar
      // e referenciando com a tabela files o campo ID.
      return queryInterface.addColumn('users', 'avatar_id', {
         type: Sequelize.INTEGER,
         references: { model: 'files', key: 'id' },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });
   },

   down: queryInterface => {
      return queryInterface.removeColumn('users', 'avatar_id');
   },
};
