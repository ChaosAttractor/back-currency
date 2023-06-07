'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('currency', {
      id: {
        type: Sequelize.STRING(7),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      NumCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      CharCode: {
        type: Sequelize.STRING(9),
        allowNull: false,
      },
      Nominal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Value: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      Previous: {
        type: Sequelize.REAL,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('currency');
  },
};
