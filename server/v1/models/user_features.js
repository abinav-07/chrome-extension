const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class UserFeatures extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      UserFeatures.belongsTo(models.Features, { foreignKey: "feature_id", as: "features" })
      UserFeatures.belongsTo(models.Users, { foreignKey: "user_id", as: "users" })
    }
  }
  UserFeatures.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      access: {
        type: DataTypes.ENUM("none", "read", "write"),
        allowNull: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "UserFeatures",
      tableName: "user_features",
    },
  )
  return UserFeatures
}
