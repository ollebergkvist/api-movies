// Module to create express instance
require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express');
const movieRoutes = require('../routes/movie.js');
const userRoutes = require('../routes/user.js');
const helmet = require('helmet'); // Secures app by setting various HTTP headers
const morgan = require('morgan'); // HTTP request logger middleware
const compression = require('compression'); // Enables gzip compression
const cors = require('cors'); // Enables CORS

function createServer() {
	const app = express(); // Binds express to app
	app.use(helmet()); // Helmet for secure headers
	app.use(compression()); // Enables gzip compression
	if (process.env.NODE_ENV !== 'test') {
		app.use(morgan('combined')); // Enables http request logging
	}
	app.use(express.json()); // Parse JSON bodies
	app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
	app.use(cors()); // Cross-origin resource sharing
	app.use('/uploads', express.static('./uploads')); // Make uploads folder static file so it can be accessed
	app.use('/api', movieRoutes); // Enables movie routes
	app.use('/api', userRoutes); // Enables user routes
	// Enables static index site
	app.route('/').get(function (req, res) {
		res.sendFile(process.cwd() + '/index.html');
	});
	// Capture All 404 errors
	app.use(function (req, res) {
		res.status(404).json({
			errors: {
				source: req.path,
				title: 'Not found',
				detail: 'Could not find path: ' + req.path,
			},
		});
	});

	return app;
}

module.exports = createServer;
