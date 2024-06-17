const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

// Create an axios instance
const api = axios.create({
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: '188e1dbc267d4553b979e4189fba3bbd',
  },
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