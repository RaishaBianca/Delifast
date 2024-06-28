// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  bio: {
    type: DataTypes.TEXT, // Use TEXT for longer strings
    allowNull: true, // Assuming bio is optional
  },
  profilePicture: {
    type: DataTypes.STRING, // Assuming the profile picture will be stored as a URL or file path
    allowNull: true, // Assuming the profile picture is optional
  },
}, {
  tableName: 'users', // Sesuaikan dengan nama tabel yang ada di database
  timestamps: false, // Sesuaikan dengan pengaturan timestamps di tabel Anda
});

module.exports = User;
