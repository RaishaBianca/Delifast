require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const secretKey = process.env.SECRET_KEY;
const api = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: '188e1dbc267d4553b979e4189fba3bbd',
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
    res.render('profile', { user: req.session.user});
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

//show all recipes
app.get('/', async (req, res) => {
  try {
    const limit = 12;
    const response = await api.get('/complexSearch', {
      params: {
        number: limit,
      },
    }); 
   res.render('index', { data: response.data.results, totalPages: 76, currentPage : 1 });
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
    
        res.render('index', { data: response.data.results, totalPages: 76, currentPage : page });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

//search for recipes
app.get('/search', async (req, res) => {
  const query = req.query.query;
  const offset = req.query.offset || 0;
  const response = await api.get('/complexSearch', {
    params: {
      query: query,
      number: 12,
      offset: offset,
    },
  });
  if(offset==0){
    res.render('search', { data: response.data.results, query: query });
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

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/login',(req,res)=>{
  res.render('login');
});

app.get('/register',(req,res)=>{
  res.render('sign-up');
});

app.listen(3000);

app.use(express.static('public'));