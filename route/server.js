require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const secretKey = process.env.SECRET_KEY;
const recommend = require('../services/recommendationService');
const api = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: '1e54f19280ac46e8b6bad1caeeb656f1',
  },
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
     secure: false,
     maxAge: 12 * 60 * 60 * 1000,
   }
}));
app.use((req,res,next) => {
  res.locals.user = req.session.user;
  next();
});

// Create an axios instance for the user service
const userService = axios.create({
  baseURL: 'http://localhost:4000',
});

app.post('/user_login', async (req, res) => {
  try {
    const response = await userService.post('/user_login', req.body);
    req.session.user = response.data;
    let favorites;
    if (req.session.user) {
      favorites = await userService.post('/user_favorites', { userId: req.session.user.id });
    }
  
    const favoriteRecipes = await api.get('/informationBulk', {
      params: {
       ids: favorites ? Array.from(new Set(favorites.data)).join(',') : '',
      },
    });
  
    res.render('profile',{ user: req.session.user, favorites: favoriteRecipes.data });
  } catch (error) {
    console.error(error);
    if(error.response.status === 404){
      res.render('login', { error: error.response.data.error, email: req.body.email});
    } else {
      res.status(500).send(error.response.data.error);
    }
  }
});

app.post('/user_register', async (req, res) => {
  try {
    const response = await userService.post('/user_register', req.body);
    req.session.user = response.data;
    res.render('profile', { user: req.session.user});
  } catch (error) {
    if(error.response.status === 404){
      res.render('sign-up', { error: error.response.data.error, username: req.body.username, email: req.body.email});
    } else {
      res.status(500).send(error.response.data.error);
    }
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

app.post('/favorites', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const response = await userService.post('/favorites', { ...req.body, userId });
    
    res.json({ message: 'favorites', userId: userId, data: response.data });
  } catch (error) {
    if (error.response) {
      res.status(500).send(error.response.data.error);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.post('/deleteFavorite', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const response = await userService.delete('/Favorite', { ...req.body, userId });
    
    res.json({ success: true});
  } catch (error) {
    if (error.response) {
      res.status(500).send(error.response.data.error);
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.get('/', async (req, res) => {
  try {
    const limit = 12;
    const response = await api.get('/complexSearch', {
      params: {
        number: limit,
      },
    }); 
    let favorites;
if (req.session.user) {
  favorites = await userService.post('/user_favorites', { userId: req.session.user.id });
}
   res.render('index', { data: response.data.results, totalPages: 76, currentPage : 1, favoritesId: favorites ? favorites.data : []});
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
  });

//show per page
app.get('/page/:page', async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 12;
        const offset = (page - 1) * limit;
    
        const response = await api.get('/complexSearch', {
        params: {
            number: limit,
            offset: offset,
        },
        });
    
        let favorites;
        if (req.session.user) {
          favorites = await userService.post('/user_favorites', { userId: req.session.user.id });
        }

        res.render('index', { data: response.data.results, totalPages: 76, currentPage : page, favoritesId: favorites ? favorites.data : [] });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

//search for recipes
app.get('/search', async (req, res) => {
  const query = req.query.query;
  const offset = req.query.offset || 0;
  let favorites; 
  const response = await api.get('/complexSearch', {
    params: {
      query: query,
      number: 12,
      offset: offset,
    },
  });
  if (req.session.user) {
    favorites = await userService.post('/user_favorites', { userId: req.session.user.id });
  }
  if(offset==0){
    res.render('search', { data: response.data.results, query: query, favoritesId: favorites ? favorites.data : [] });
  }
  else {
    //send json
    res.json(response.data.results);
  }
});

//get information for specific recipes 
app.get('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const response = await api.get(`/${id}/information`);
  const recipe = response.data;
  res.render('recipe', { recipe });
});

async function updateRecommendations(userId, favorites) {
  const recommendations = await recommend(userId ,favorites);
  if (recommendations.error) {
    setTimeout(() => updateRecommendations(userId, favorites), 24 * 60 * 60 * 1000);
    return;
  }
  return recommendations;
}

setInterval(async () => { // Add async keyword
  const users = await User.findAll();
  for (const user of users) {
      await updateRecommendations(user.id); // Add await keyword
  }
}, 24 * 60 * 60 * 1000); 

app.get('/profile', async (req, res) => {
  let favorites;
  if (req.session.user) {
    favorites = await userService.post('/user_favorites', { userId: req.session.user.id });
  }

  const favoriteRecipes = await api.get('/informationBulk', {
    params: {
     ids: favorites ? Array.from(new Set(favorites.data)).join(',') : '',
    },
  });

  const recommendations = await updateRecommendations(req.session.user.id, favoriteRecipes.data);

  res.render('profile',{favorites: favoriteRecipes.data, recommendations });
});


app.get('/login',(req,res)=>{
  res.render('login');
});

app.get('/register',(req,res)=>{
  res.render('sign-up');
});

app.listen(3000);

app.use(express.static('public'));













