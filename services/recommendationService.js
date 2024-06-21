// recommendationService.js
const axios = require('axios');
const Recommendation = require('../models/recommendation');

const user_rec = async (userId) => {
    const userRec = await Recommendation.findAll({ where: { userId } });
    const response = await axios.get(`https://api.spoonacular.com/recipes/informationBulk?ids=${userRec.map(rec => rec.recipeId).join(',')}&apiKey=ad9e72a6509942e7a37d224ecc08d97f`);
    return response;
};

const recommend = async (userId ,favorites) => {
    const existingRecommendation = await Recommendation.findOne({ where: { userId } });
    if (existingRecommendation) {
        return { error: 'User already in the recommendation table', success: false };
    }

    await Recommendation.destroy({ where: { userId } });
    const cuisines = {};
    const diets = {};
    const dishTypes = {};

    favorites.forEach(favorite => {
        favorite.cuisines.forEach(cuisine => cuisines[cuisine] = (cuisines[cuisine] || 0) + 1);
        favorite.diets.forEach(diet => diets[diet] = (diets[diet] || 0) + 1);
        favorite.dishTypes.forEach(dishType => dishTypes[dishType] = (dishTypes[dishType] || 0) + 1);
    });

    const mostCommonCuisine = Object.keys(cuisines).length ? Object.keys(cuisines).reduce((a, b) => cuisines[a] > cuisines[b] ? a : b) : '';
    const mostCommonDiet = Object.keys(diets).length ? Object.keys(diets).reduce((a, b) => diets[a] > diets[b] ? a : b) : '';
    const mostCommonDishType = Object.keys(dishTypes).length ? Object.keys(dishTypes).reduce((a, b) => dishTypes[a] > dishTypes[b] ? a : b) : '';

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${mostCommonCuisine}&diet=${mostCommonDiet}&type=${mostCommonDishType}&number=3&apiKey=ad9e72a6509942e7a37d224ecc08d97f`);
    
    const recommendations = response.data.results;

    for (const recipe of recommendations) {
        const newRecommendation = new Recommendation({ userId, recipeId: recipe.id });
        await newRecommendation.save();
    }

    return recommendations;
};

module.exports = {user_rec, recommend};