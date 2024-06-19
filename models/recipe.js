// recipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ingredients: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Recipe;
