// create some routes which can recieve the incoming request

const express = require('express');
const router = express.Router();

const controller = require('../Controllers/index');

router.get('/movies', controller.getAllMovies);

router.get('/movies/:id', controller.getMovieById);


// Example: axios.get(`http://localhost:5400/getMoviesByLanguage/${language}`)
router.get('/getMoviesByLanguage/:language', controller.getMoviesByLanguage);

// Example: axios.get(`http://localhost:5400/getMovieByTitle/${title}`)
router.get('/getMovieByTitle/:title', controller.getMovieByTitle);

// User routes
router.post('/signup', controller.signup);
router.post('/login', controller.login);

module.exports = router;
