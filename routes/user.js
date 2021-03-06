const express = require('express'); // Express module
const router = express.Router(); // Bind express method to router
const schemas = require('../middleware/schemas.js'); // Joi schemas
const validator = require('express-joi-validation').createValidator({}); // Middleware to validate req.body, req.params and req.query
const userController = require('../controllers/user.js'); // Route handler for users
const auth = require('../middleware/auth.js'); // Middleware to authenticate with JWT
const admin = require('../middleware/admin.js'); // Middleware to verify admin rights

// Update user permissions
// Admin only
router.put(
	'/users/:id',
	auth,
	admin,
	validator.params(schemas.id),
	validator.body(schemas.updateUser),
	userController.updateUserRights
);

// Get all users
// Admin only
router.get('/users', auth, admin, userController.getUsers);

// Get user by id
// Admin only
router.get(
	'/users/:id',
	auth,
	admin,
	validator.params(schemas.id),
	userController.getUser
);

// Register user
router.post(
	'/register',
	validator.body(schemas.register),
	userController.register
);

// Verify
router.get(
	'/verify/:uniqueString',
	// validator.body(schemas.verify),
	userController.verify
);

// Login
router.post('/login', validator.body(schemas.login), userController.login);

// Forgot
router.post(
	'/forgot',
	validator.body(schemas.forgot),
	userController.forgotPassword
);

// Reset
router.get('/reset/:token', userController.reset);

// Reset
router.post(
	'/reset/:token',
	validator.body(schemas.reset),
	userController.resetPassword
);

// Like movie
// Registered users
router.put(
	'/favorite',
	auth,
	validator.body(schemas.favorite),
	userController.addFavoriteMovie
);

module.exports = router;
