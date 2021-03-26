// Movie controller
// Handles db logic

const Movie = require('../schemas/movie.js'); // Movie mongoose schema
const User = require('../schemas/user.js'); // User mongoose schema
const Rent = require('../schemas/rent.js'); // Rent mongoose schema
const Purchase = require('../schemas/purchase.js'); // Purchase mongoose schema
const aqp = require('api-query-params'); // Module to convert query params to mongodb query object
const setPaginationOptions = require('../models/pagination_options.js'); // Helper function to set options for pagination depending on queries supplied
const setLoggingData = require('../models/log_options.js'); // Helper function to set logging data depending on queries supplied
const getCurrentDateAndTime = require('../models/date_time.js'); // Helper function to get and format date and time
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
	format: winston.format.json(),
	showLevel: false,
	transports: [
		new winston.transports.File({ filename: path.join('log', '/log.txt') }),
	],
});

// Controller for retrieving all movies
// Pagination, limiting, sorting and filtering enabled
const getMovies = async (req, res) => {
	const queryPage = aqp(req.query).filter.page;
	const querySort = aqp(req.query).sort;
	const queryLimit = aqp(req.query).limit;
	const options = await setPaginationOptions(queryPage, querySort, queryLimit);

	try {
		const movies = await Movie.paginate({ availability: 'true' }, options);

		if (!movies) {
			res.status(404).json({
				status: '404',
				type: 'Error',
				source: req.path,
				detail: 'No movies available to fetch',
				document: movies,
			});
		}

		res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'Movies fetched',
			document: movies,
		});
	} catch (err) {
		res.status(500).json({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for retrieving all movies
// Pagination, sorting and filtering enabled
const getMoviesAdmin = async (req, res, next) => {
	const filter = aqp(req.query).filter;
	const queryPage = aqp(req.query).filter.page;
	const querySort = aqp(req.query).sort;
	const queryLimit = aqp(req.query).limit;

	if (queryPage) {
		delete filter.page;
	}

	const options = await setPaginationOptions(queryPage, querySort, queryLimit);

	try {
		const movies = await Movie.paginate(filter, options);

		if (!movies) {
			res.status(404).json({
				status: '404',
				type: 'Error',
				source: req.path,
				detail: 'No movies available to fetch',
				document: movies,
			});
		}

		res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'Movies fetched',
			document: movies,
		});
	} catch (err) {
		res.status(500).json({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for retrieving a movie by ID
const getMovie = async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);

		if (!movie) {
			res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: 'Movie with given id could not be found',
			});
		}

		if (movie.availability === 'false') {
			res.status(402).json({
				status: '402',
				type: 'Error',
				source: req.path,
				detail: 'Unauthorized resource targeted',
			});
		}

		return res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'Movie fetched',
			document: movie,
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for retrieving a movie by ID
const getMovieAdmin = async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);

		if (!movie) {
			res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: 'Movie with given id could not be found',
			});
		}

		return res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'Movie fetched',
			document: movie,
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for searching for movies
const searchMovies = async (req, res) => {
	try {
		const movie = await Movie.find({
			availability: 'true',
			title: { $regex: req.query.title, $options: 'i' },
		});

		if (movie.length === 0) {
			res.status(404).json({
				status: '404',
				type: 'Error',
				source: req.path,
				detail: 'Movie could not be found',
			});
		}

		if (movie.availability === 'false') {
			res.status(402).json({
				status: '402',
				type: 'Error',
				source: req.path,
				detail: 'Unauthorized resource targeted',
			});
		}

		res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'Movie fetched',
			document: movie,
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for searching for movies
const searchMoviesAdmin = async (req, res) => {
	try {
		const movie = await Movie.find({
			title: { $regex: req.query.title, $options: 'i' },
		});

		if (movie.length === 0) {
			res.status(404).json({
				status: '404',
				type: 'Error',
				source: req.path,
				detail: 'Movie could not be found',
			});
		}

		res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'Movie fetched',
			document: movie,
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for creating a movie
const createMovie = async (req, res) => {
	const movieExists = await Movie.findOne({ title: req.body.title });
	if (movieExists) {
		return res.status(400).send({
			status: '400',
			type: 'Error',
			source: req.path,
			title: 'Movie exists already',
		});
	}

	const movie = new Movie({
		title: req.body.title,
		description: req.body.description,
		image: req.file.path,
		stock: req.body.stock,
		rental_price: req.body.rental_price,
		sales_price: req.body.sales_price,
		availability: req.body.availability,
	});

	try {
		movie.save();
		return res.status(201).json({
			status: '201',
			type: 'Success',
			source: req.path,
			message: 'Movie successfully created',
			document: movie,
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for updating a movie
const updateMovie = async (req, res, next) => {
	const entries = Object.keys(req.body);
	const updates = {};

	// constructing dynamic query
	for (let i = 0; i < entries.length; i++) {
		updates[entries[i]] = Object.values(req.body)[i];
	}

	try {
		const movie = await Movie.findById(req.params.id);

		if (!movie) {
			return res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Movie with given id could not be found',
			});
		}

		await Movie.updateOne(
			{ _id: req.params.id },
			{
				$set: updates,
			}
		);

		// Data to log
		const data = await setLoggingData(
			req.body.title,
			req.body.sales_price,
			req.body.rental_price
		);

		// Log to json file
		logger.log(data);

		return res.status(204).json({
			status: '204',
			type: 'Success',
			source: req.path,
			message: 'Movie updated successfully',
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for hard deleting a movie
const deleteMovie = async (req, res, next) => {
	try {
		const movieExists = await Movie.findById(req.params.id);

		if (!movieExists) {
			return res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Movie with given id could not be found',
			});
		}

		await Movie.deleteOne({ _id: req.params.id });

		return res.status(204).json({
			status: '204',
			type: 'Success',
			source: req.path,
			message: 'Movie deleted successfully',
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for soft deleting a movie (mark as deleted)
const removeMovie = async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);

		if (!movie) {
			return res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Movie with given id could not be found',
			});
		}

		movie.delete();

		res.status(204).json({
			status: '204',
			type: 'Success',
			source: req.path,
			message: 'Movie successfully removed',
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for changing availability of a movie
const availability = async (req, res) => {
	try {
		const movie = await Movie.findByIdAndUpdate(
			req.params.id,
			{ availability: true },
			{ new: true }
		);

		if (!movie) {
			return res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Movie with given id could not be found',
			});
		}

		res.status(204).json({
			status: '204',
			type: 'Success',
			source: req.path,
			message: 'Movie availability successfully updated',
		});
	} catch (err) {
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for renting a movie
const rentMovie = async (req, res) => {
	const movie = await Movie.findById(req.body.movie_id);
	const user = await User.findById(req.body.customer_id);
	const movieStock = movie.stock;
	const orderAmount = req.body.amount;

	// Check if movie exists in db
	if (!movie) {
		return res.status(400).send({
			status: '400',
			type: 'Error',
			source: req.path,
			title: 'Movie with given id could not be found',
		});
	}

	// Check if movie exists in db
	if (!user) {
		return res.status(400).send({
			status: '400',
			type: 'Error',
			source: req.path,
			title: 'User with given id could not be found',
		});
	}

	// Checks that there are sufficient movies in stock to continue with the rental
	if (movieStock >= orderAmount) {
		// Calculate stock
		const newStock = movieStock - orderAmount;

		// Create mongodb document
		const rent = new Rent({
			movieID: req.body.movie_id,
			customerID: req.body.customer_id,
			amount: req.body.amount,
			cost: req.body.cost,
		});

		// Update stock and create rental order
		try {
			await rent.save();
			await movie.update({
				stock: newStock,
			});

			return res.status(201).json({
				status: '201',
				type: 'Success',
				source: req.path,
				message: 'Movie successfully rented',
				document: rent,
			});
		} catch (err) {
			return res.status(404).send({
				status: '404',
				type: 'Error',
				source: req.path,
				title: 'Database error',
				message: err.message,
			});
		} finally {
			// Get timestamp
			const currentDateAndTime = await getCurrentDateAndTime();
			const amount = req.body.amount;
			const amountAsString = amount.toString();

			// Log to json file
			logger.log({
				level: 'info',
				date: currentDateAndTime,
				type: 'Order confirmation',
				category: 'Rental',
				customer: user.email,
				title: movie.title,
				copies: amountAsString,
			});
		}
	} else {
		return res.status(500).json({
			status: '500',
			type: 'Error',
			source: req.path,
			message: 'Insufficient stock to complete order',
		});
	}
};

// Controller for purchasing a movie
const purchaseMovie = async (req, res) => {
	const movie = await Movie.findById(req.body.movie_id);
	const user = await User.findById(req.body.customer_id);
	const movieStock = movie.stock;
	const orderAmount = req.body.amount;

	// Check if movie exists in db
	if (!movie) {
		return res.status(400).send({
			status: '400',
			type: 'Error',
			source: req.path,
			title: 'Movie with given id could not be found',
		});
	}

	// Check if movie exists in db
	if (!user) {
		return res.status(400).send({
			status: '400',
			type: 'Error',
			source: req.path,
			title: 'User with given id could not be found',
		});
	}

	// Checks that there are sufficient movies in stock to continue with the rental
	if (movieStock >= orderAmount) {
		const newStock = movieStock - orderAmount;
		const purchase = new Purchase({
			movieID: req.body.movie_id,
			customerID: req.body.customer_id,
			amount: req.body.amount,
			cost: req.body.cost,
		});

		try {
			await purchase.save();
			await movie.update({
				stock: newStock,
			});

			return res.status(201).json({
				status: '201',
				type: 'Success',
				source: req.path,
				message: 'Movie successfully purchased',
				document: purchase,
			});
		} catch (err) {
			return res.status(500).send({
				status: '500',
				type: 'Error',
				source: req.path,
				title: 'Database error',
				message: err.message,
			});
		} finally {
			// Get timestamp
			const currentDateAndTime = await getCurrentDateAndTime();
			const amount = req.body.amount;
			const amountAsString = amount.toString();

			// Log to json file
			logger.log({
				level: 'info',
				date: currentDateAndTime,
				type: 'Order confirmation',
				category: 'Purchase',
				customer: user.email,
				title: movie.title,
				copies: amountAsString,
			});
		}
	} else {
		return res.status(400).json({
			status: '400',
			type: 'Error',
			source: req.path,
			message: 'Insufficient stock to complete order',
		});
	}
};

// Controller for renting a movie
const returnMovie = async (req, res) => {
	try {
		var rent = await Rent.findById(req.params.id);

		// Check if Order exists in db
		if (!rent) {
			return res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Rental order with given id could not be found',
			});
		}
	} catch (err) {
		return res.status(404).send({
			status: '404',
			type: 'Error',
			source: req.path,
			message: 'Order with given id could not be found',
		});
	} finally {
		const currentTime = Date.now();
		const returnDate = rent.returnDate;
		const returnTime = returnDate.getTime();
		const timeDifference = currentTime - returnTime;
		const dayDifference = Math.round(timeDifference / (1000 * 3600 * 24));
		const penaltySum = 5;
		const penaltyCharge = dayDifference * penaltySum;

		// Checks if movie is not returned on time
		if (currentTime > returnTime) {
			rent.penalty = penaltyCharge;
			rent.returned = true;
			rent.returnedAt = Date.now();
			rent.save();
		} else {
			rent.returned = true;
			rent.returnedAt = Date.now();
			rent.save();
		}

		return res.status(201).json({
			status: '201',
			type: 'Success',
			source: req.path,
			message: 'Movie successfully returned',
		});
	}
};

module.exports = {
	getMovies,
	getMoviesAdmin,
	getMovie,
	getMovieAdmin,
	searchMovies,
	searchMoviesAdmin,
	createMovie,
	updateMovie,
	deleteMovie,
	removeMovie,
	availability,
	purchaseMovie,
	rentMovie,
	returnMovie,
};
