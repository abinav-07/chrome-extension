"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          first_name: {
            type: Sequelize.DataTypes.STRING(256),
            allowNull: false,
          },
          last_name: {
            type: Sequelize.DataTypes.STRING(256),
            allowNull: false,
          },
          email: {
            type: Sequelize.DataTypes.STRING(256),
            allowNull: false,
            validate: {
              isEmail: true,
            },
            unique: true,
          },
          password: {
            type: Sequelize.DataTypes.STRING(256),
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("users", { transaction: t })
    })
  },
}
