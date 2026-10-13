'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rosters', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      juego: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'League of Legends' },
      tipo: { type: Sequelize.ENUM('Principal', 'Academy'), allowNull: false, defaultValue: 'Principal' },
      temporada: { type: Sequelize.STRING(20), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false }, updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('rosters'); }
};
