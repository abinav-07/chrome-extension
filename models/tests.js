'use strict';
const {
    Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tests extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here  
            Tests.hasMany(models.Questions, {
                sourceKey: "id",
                foreignKey: "test_id",
                as: "test_questions"
            });

            Tests.hasMany(models.UserTestReport, {
                sourceKey: "id",
                foreignKey: "test_id",
                as: "user_test_report"
            })
        }
    };
    Tests.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        is_available: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        }
    }, {
        timestamps: false,
        sequelize,
        modelName: 'Tests',
        tableName: "tests"
    });
    return Tests;
};