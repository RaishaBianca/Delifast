const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.post('/user_login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //validate email and password
        if (!email || !password) {
            return res.status(404).json({ error: 'Email and password are required' });
        }
        const user = await User.findOne({
            where: {
                email,
            },
        });
        const match = user && await bcrypt.compare(password, user.password);
        if (!user || !match) {
            return res.status(404).json({ error: 'Invalid email or password' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to retrieve users from database' });
    }
});

app.post('/user_register', async (req, res) => {
    const { username, email, password } = req.body;
    //validate
    if (!username || !email || !password) {
        return res.status(404).json({ error: 'Username, email, and password are required' });
    }
    else if (!email.includes('@')) {
        return res.status(404).json({ error: 'Invalid email' });
    } 
    const trimmedEmail = email.trim();
    try {
        const newUser = await User.create({
            username,
            email: trimmedEmail,
            password: bcrypt.hashSync(password, saltRounds),
        });
    
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.original.code === 'ER_DUP_ENTRY' || error.original.sqlMessage.includes("Duplicate entry")) {
            res.status(404).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create new user' });
        }
    }
});

app.post('/favorites', async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
      const newFavorite = await Favorite.create({ userId, recipeId });
      res.json({ success: true, favorite: newFavorite });
    } catch (error) {
      console.error('Error creating favorite:', error);
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  });

sequelize
    .sync({ force: false }) 
    .then(() => {
        console.log('Database synced.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to sync database:', error);
    });



    