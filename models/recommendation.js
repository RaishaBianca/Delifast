// recommendation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); 

const Recommendation = sequelize.define('Recommendation', {
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
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Recommendation;