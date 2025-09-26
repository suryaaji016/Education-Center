"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    static associate(models) {
      Score.belongsTo(models.User, { foreignKey: "userId" });
      Score.belongsTo(models.Exercise, { foreignKey: "exerciseId" }); 
    }

    get nilaiFinal() {
      return (this.finalScore || 0) * 10;
    }
  }

  Score.init(
    {
      userId: DataTypes.INTEGER,
      exerciseId: DataTypes.INTEGER,
      finalScore: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Score",
    }
  );

  return Score;
};
