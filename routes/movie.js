const express = require('express'); // Express module
const router = express.Router(); // Bind express method to router
const movieController = require('../controllers/movie.js'); // Route handler for movies
const schemas = require('../middleware/schemas.js'); // Joi schemas
const validator = require('express-joi-validation').createValidator({}); // Middleware to validate req.body, req.params and req.query
const auth = require('../middleware/auth.js'); // Middleware to authenticate with JWT
const admin = require('../middleware/admin.js'); // Middleware to verify admin rights
const uploadImage = require('../middleware/upload-image.js'); //Middleware to upload images to server

// Get all movies
// All users
// Only movies that are marked available
router.get('/movies', movieController.getMovies);

// Get all movies
// Movies that are marked available and unavailable
// Admin only
router.get('/admin/movies', auth, admin, movieController.getMoviesAdmin);

// Get single movie by id
// All users
// Only movies that are marked available
router.get(
	'/movies/:id',
	validator.params(schemas.id),
	movieController.getMovie
);

// Get single movie by id
// Movies that are marked available and unavailable
// Admin only
router.get(
	'/admin/movies/:id',
	auth,
	admin,
	validator.params(schemas.id),
	movieController.getMovieAdmin
);

// Search
// All users
// Only movies that are marked available
router.get(
	'/search',
	validator.query(schemas.search),
	movieController.searchMovies
);

// Search
// Admin only
router.get(
	'/admin/search',
	auth,
	admin,
	validator.query(schemas.search),
	movieController.searchMoviesAdmin
);

// Create movie
// Admin only
router.post(
	'/movies',
	auth,
	admin,
	uploadImage,
	validator.body(schemas.create),
	movieController.createMovie
);

// Update movie
// Admin only
router.put(
	'/movies/:id',
	auth,
	admin,
	uploadImage,
	validator.params(schemas.id),
	validator.body(schemas.put),
	movieController.updateMovie
);

// Delete movie (Hard delete)
// Admin only
router.delete(
	'/movies/:id',
	auth,
	admin,
	validator.params(schemas.id),
	movieController.deleteMovie
);

// Remove movie (Soft delete)
// Admin only
router.put(
	'/remove/:id',
	auth,
	admin,
	validator.params(schemas.id),
	movieController.removeMovie
);

// Change availability of movie by id
// Admin only
router.put(
	'/availability/:id',
	auth,
	admin,
	validator.params(schemas.id),
	movieController.availability
);

// Rent movie
// Registered users
router.post(
	'/movies/rent',
	auth,
	validator.body(schemas.rent),
	movieController.rentMovie
);

// Purchase movie
// Registered users
router.post(
	'/movies/purchase',
	auth,
	validator.body(schemas.purchase),
	movieController.purchaseMovie
);

// Return movie
// Admin only
router.put(
	'/return/:id',
	auth,
	admin,
	validator.params(schemas.id),
	movieController.returnMovie
);

module.exports = router;
