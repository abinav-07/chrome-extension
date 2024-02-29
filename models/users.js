'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here such as belongsto, has, hasMany and so on
        }
    };
    Users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true,
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
    }, {
        timestamps: false,
        sequelize,
        modelName: 'Users',
        tableName: "users"
    });
    return Users;
};