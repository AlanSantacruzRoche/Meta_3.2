'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jugadores', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
      nickname: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      nombre_real: { type: Sequelize.STRING(120), allowNull: true },
      pais: { type: Sequelize.STRING(80), allowNull: true },
      rol: { type: Sequelize.ENUM('Top', 'Jungle', 'Mid', 'ADC', 'Support'), allowNull: false },
      estado: { type: Sequelize.ENUM('activo', 'inactivo'), allowNull: false, defaultValue: 'activo' },
      created_at: { type: Sequelize.DATE, allowNull: false }, updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('jugadores'); }
};
