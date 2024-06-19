// savedRecipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // Corrected path
const Recipe = require('./recipe'); // Corrected path

const SavedRecipe = sequelize.define('SavedRecipe', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id'
    }
  }
});

module.exports = SavedRecipe;
