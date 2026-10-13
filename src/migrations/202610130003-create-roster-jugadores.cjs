'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roster_jugadores', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
      id_roster: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'rosters', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      id_jugador: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'jugadores', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      rol_en_roster: { type: Sequelize.ENUM('Titular', 'Suplente'), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false }, updated_at: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addConstraint('roster_jugadores', { fields: ['id_roster', 'id_jugador'], type: 'unique', name: 'uq_jugador_por_roster' });
  },
  async down(queryInterface) { await queryInterface.dropTable('roster_jugadores'); }
};
