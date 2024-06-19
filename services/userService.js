const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.post('/user_login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await User.findAll({
            where: {
                email,
                password,
            },
        });
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = users[0];
        // const match = await bcrypt.compare(password, user.password);
        // if (!match) {
            // return res.status(401).json({ error: 'Incorrect password' });
        // }
        res.json(user);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to retrieve users from database' });
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, saltRounds),
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create new user' });
    }
});

// Sync database and start server
sequelize
    .sync({ force: false }) // Set force to true to drop tables on every restart (use with caution)
    .then(() => {
        console.log('Database synced.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to sync database:', error);
    });

