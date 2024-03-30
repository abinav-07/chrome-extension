const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Features extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here such as belongsto, has, hasMany and so on
      Features.hasMany(models.UserFeatures, { foreignKey: "feature_id" })
    }
  }
  Features.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      feature_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "Features",
      tableName: "features",
    },
  )
  return Features
}
