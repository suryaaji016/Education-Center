'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCategory extends Model {
    static associate(models) {
    }
  }

  UserCategory.init({
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserCategory',
  });
  return UserCategory;
};
