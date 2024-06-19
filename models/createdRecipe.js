const Sequelize = require('sequelize');

const sequelize = new Sequelize('delifast', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const CreatedRecipe = sequelize.define('CreatedRecipe', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT, // Changed to TEXT
    allowNull: true, // Adjust as needed
  },
  ingredients: {
    type: Sequelize.TEXT, // Changed to TEXT
    allowNull: false,
    get() {
      const value = this.getDataValue('ingredients');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('ingredients', JSON.stringify(value));
    },
  },
  instructions: {
    type: Sequelize.TEXT, // Changed to TEXT
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = CreatedRecipe;
