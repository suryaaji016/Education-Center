"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Category, { foreignKey: "categoryId" });
      Course.belongsTo(models.User, { foreignKey: "userId" }); 
      Course.hasMany(models.Exercise, { foreignKey: "courseId" });
    }
  }

  Course.init(
    {
      name: DataTypes.STRING,      
      description: DataTypes.TEXT,
      duration: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Course",
    }
  );

  return Course;
};
