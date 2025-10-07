const Movie = require("../Models/movies.js");
const User = require("../Models/User.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    const normalizedList = movies.map(m => ({
      id: m.id,
      movie: m.title,       // rename for frontend
      category: m.genre,    // rename for frontend
      image: m.image,         // rename for frontend
      img: m.image,         // thumbnail key
      language: m.language,
      director: m.director,
      year: m.year,
      rating: m.rating || null
    }));

    res.status(200).json({ movieList: normalizedList });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

// Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findOne({ id: movieId });

    if (movie) {
      const normalizedMovie = {
        id: movie.id,
        movie: movie.title,
        category: movie.genre,
        image: movie.image,
        img: movie.image,
        language: movie.language,
        director: movie.director,
        year: movie.year,
        rating: movie.rating || null
      };
      res.status(200).json({ movie: normalizedMovie });
    } else {
      res.status(404).json({
        message: `No movie found with ID ${movieId}`
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

// Get movies by language (case-insensitive)
const getMoviesByLanguage = async (req, res) => {
  try {
    const language = req.params.language.trim();
    const filteredMovies = await Movie.find({ language: new RegExp(language, 'i') });

    if (filteredMovies.length > 0) {
      const normalizedList = filteredMovies.map(m => ({
        id: m.id,
        movie: m.title,
        category: m.genre,
        image: m.image,
        img: m.image,
        language: m.language,
        director: m.director,
        year: m.year,
        rating: m.rating || null
      }));
      res.status(200).json({ movieList: normalizedList });
    } else {
      res.status(404).json({
        message: `No movies found in language "${req.params.language}"`
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies by language', error: error.message });
  }
};

// Get movies by title (case-insensitive, partial match)
const getMovieByTitle = async (req, res) => {
  try {
    const title = req.params.title.trim();
    const filteredMovies = await Movie.find({ title: new RegExp(title, 'i') });

    if (filteredMovies.length > 0) {
      const normalizedList = filteredMovies.map(m => ({
        id: m.id,
        movie: m.title,
        category: m.genre,
        image: m.image,
        img: m.image,
        language: m.language,
        director: m.director,
        year: m.year,
        rating: m.rating || null
      }));
      res.status(200).json({ movieList: normalizedList });
    } else {
      res.status(404).json({
        message: `No movies found with title "${req.params.title}"`
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies by title', error: error.message });
  }
};

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup request:", { name, email, password: "***" });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "secretKey", { expiresIn: "1h" });

    console.log("Signup successful for:", email);

    res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login
const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// Lucky
const lucky = (req, res) => {
  console.log("User already exists:", email);
  return res.status(400).json({ message: "User already exists" });
};


module.exports = {
  getAllMovies,
  getMovieById,
  getMoviesByLanguage,
  getMovieByTitle,
  signup,
  login,
  lucky
};
