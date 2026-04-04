const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['viewer', 'analyst', 'admin']],
      },
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
  }
);

module.exports = Role;
