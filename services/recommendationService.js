// recommendationService.js
const axios = require('axios');
const Recommendation = require('../models/recommendation');

const user_recommendation = async (userId) => {
    const userRec = await Recommendation.findAll({ where: { userId } });
    return userRec;
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

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?cuisine=${mostCommonCuisine}&diet=${mostCommonDiet}&type=${mostCommonDishType}&number=3&apiKey=1e54f19280ac46e8b6bad1caeeb656f1`);
    
    const recommendations = response.data.results;

    for (const recipe of recommendations) {
        const newRecommendation = new Recommendation({ userId, recipeId: recipe.id });
        await newRecommendation.save();
    }

    return recommendations;
};

module.exports = recommend;