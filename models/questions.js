'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Questions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here   
            Questions.hasMany(models.Options, {
                targetKey: "id",
                foreignKey: "question_id",
                as: "options"
            });
        }
    };
    Questions.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(256),
            allowNull: false,
            defaultValue: "mcq"
        },
        test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
        sequelize,
        modelName: 'Questions',
        tableName: "questions"
    });
    return Questions;
};