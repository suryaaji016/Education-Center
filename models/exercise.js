"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      Exercise.belongsTo(models.Course, { foreignKey: "courseId" });
      Exercise.hasMany(models.Score, { foreignKey: "exerciseId" });
    }
  }

  Exercise.init(
    {
      question: DataTypes.STRING,
      answerKey: DataTypes.STRING,
      courseId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Exercise",
    }
  );

  return Exercise;
};
