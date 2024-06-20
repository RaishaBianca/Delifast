// favorite.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); 

const Favorite = sequelize.define('Favorite', {
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

module.exports = Favorite;
