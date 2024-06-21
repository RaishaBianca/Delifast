const sequelize = require('./config/database');
const Recommendation = require('./models/recommendation');

sequelize.sync()
  .then(() => console.log('Recommendation table has been successfully created, if one doesn\'t exist'))
  .catch(error => console.log('This error occured', error));