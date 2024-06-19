const Sequelize = require('sequelize');

const sequelize = new Sequelize('delifast', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
