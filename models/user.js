"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: " Email sudah terdaftar!" },
        validate: {
          notEmpty: { msg: " Email tidak boleh kosong!" },
          isEmail: { msg: " Format email tidak valid!" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: " Password tidak boleh kosong!" },
          len: { args: [8], msg: " Password minimal 8 karakter!" }
        }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: " Role tidak boleh kosong!" },
          isIn: {
            args: [["student", "teacher"]],
            msg: " Role hanya boleh student atau teacher!"
          }
        }
      }
    },
    {
      hooks: {
        beforeCreate: (user) => {
          if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
          }
        }
      },
      sequelize,
      modelName: "User"
    }
  );
  return User;
};
