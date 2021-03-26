// User controller
// Handles db logic

const bcrypt = require('bcryptjs'); // Password-hashing module
const jwt = require('jsonwebtoken'); // Create and valide JWT
const userSchema = require('../schemas/user.js'); // User mongoose schema
const Movie = require('../schemas/movie.js'); // Movie mongoose schema
const randomToken = require('random-token');
const nodemailer = require('nodemailer');

// Controller for updating a user´s rights
const updateUserRights = async (req, res) => {
	try {
		const user = await userSchema.findByIdAndUpdate(
			req.params.id,
			{ admin: req.body.admin },
			{ new: true }
		);

		if (!user) {
			return res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: 'User with given id could not be found',
			});
		}

		return res.status(204).json({
			status: '204',
			type: 'Success',
			source: req.path,
			detail: 'User rights updated successfully',
		});
	} catch (err) {
		return res.status(500).send({
			status: '404',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for fetching all users
const getUsers = (req, res) => {
	userSchema.find().then((users) => {
		return res.status(200).json({
			status: '200',
			type: 'Success',
			message: 'Users retrieved successfully',
			documents: users,
		});
	});
};

// Controller for fetching a user by id
const getUser = async (req, res) => {
	try {
		const user = await userSchema.findById(req.params.id);

		if (!user) {
			res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: 'User with given id could not be found',
			});
		}

		return res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail: 'User found',
			document: user,
		});
	} catch (err) {
		return res.status(404).send({
			status: '404',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			detail: err.message,
		});
	}
};

// Controller for registering account
const register = async (req, res) => {
	const saltRounds = 10;

	// Try to hash password
	try {
		var hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
	} catch (err) {
		return res.status(500).json({
			errors: {
				status: '500',
				type: 'Error',
				source: req.path,
				title: 'Bcrypt error',
				detail: 'Bcrypt was unable to hash password',
			},
		});
	}

	// Try to create user
	try {
		const newUser = new userSchema({
			email: req.body.email,
			password: hashedPassword,
			admin: req.body.admin,
		});

		// Checks if email address is registered already
		const user = await userSchema.findOne({ email: req.body.email });
		if (user) {
			return res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Registration error',
				detail: 'An account with this email already exists',
			});
		} else {
			// Saves new user
			await newUser.save();
			return res.status(201).send({
				status: '201',
				type: 'Success',
				source: req.path,
				detail: 'Registration succeeded',
			});
		}
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

// Controller for login
const login = async (req, res) => {
	const secret = process.env.SECRET;
	try {
		// Try to find a user with given email
		const user = await userSchema.findOne({ email: req.body.email });

		// Error handling if a user with given email was not found
		if (!user) {
			res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Authorization error',
				detail: 'Account with given email was not found.',
			});
		} else {
			// Compares password from http request with password in db
			bcrypt.compare(req.body.password, user.password, (err, result) => {
				if (err) {
					return res.status(500).json({
						status: '500',
						type: 'Error',
						source: req.path,
						title: 'Bcrypt error',
						detail: 'Bcrypt was unable to compare passwords',
					});
				}

				if (!result) {
					return res.status(401).json({
						status: '401',
						type: 'Error',
						source: req.path,
						title: 'Authorization error',
						detail: 'Wrong password',
					});
				}

				// Creates jwt token
				const payload = { email: user.email, admin: user.admin };
				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
				});

				return res.status(200).json({
					status: '200',
					type: 'Success',
					source: req.path,
					detail: 'User logged in',
					user: user.email,
					admin: user.admin,
					token: token,
				});
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			detail: err.message,
		});
	}
};

// Controller for login
const forgotPassword = async (req, res) => {
	try {
		// Try to find a user with given email
		const user = await userSchema.findOne({ email: req.body.email });

		// Error handling if a user with given email was not found
		if (!user) {
			res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Authorization error',
				detail: 'Account with given email was not found.',
			});
		} else {
			const token = randomToken(16); // Generates random token

			// Saves reset token and token expiration time in db
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000;
			await user.save();

			// SMTP setup
			const smtp = nodemailer.createTransport('SMTP', {
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});

			// Mail options
			const mailOptions = {
				to: 'ollebergkvist@gmail.com',
				from: 'hello@ollebergkvist.com',
				subject: 'API-Movies Password Reset',
				text:
					'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' +
					req.headers.host +
					'/reset/' +
					token +
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n',
			};

			// Sends email
			const info = await smtp.sendMail(mailOptions);

			console.log('Message sent: %s', info.messageId);

			// 	// Creates jwt token
			// 	const payload = { email: user.email, admin: user.admin };
			// 	const token = jwt.sign(payload, secret, {
			// 		expiresIn: '24h',
			// 	});
		}
	} catch (err) {
		return res.status(500).json({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			detail: err.message,
		});
	}
};

// Controller for login
const resetPassword = async (req, res) => {
	const secret = process.env.SECRET;
	try {
		// Try to find a user with given email
		const user = await userSchema.findOne({ email: req.body.email });

		// Error handling if a user with given email was not found
		if (!user) {
			res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Authorization error',
				detail: 'Account with given email was not found.',
			});
		} else {
			// Compares password from http request with password in db
			bcrypt.compare(req.body.password, user.password, (err, result) => {
				if (err) {
					return res.status(500).json({
						status: '500',
						type: 'Error',
						source: req.path,
						title: 'Bcrypt error',
						detail: 'Bcrypt was unable to compare passwords',
					});
				}

				if (!result) {
					return res.status(401).json({
						status: '401',
						type: 'Error',
						source: req.path,
						title: 'Authorization error',
						detail: 'Wrong password',
					});
				}

				// Creates jwt token
				const payload = { email: user.email, admin: user.admin };
				const token = jwt.sign(payload, secret, {
					expiresIn: '24h',
				});

				return res.status(200).json({
					status: '200',
					type: 'Success',
					source: req.path,
					detail: 'User logged in',
					user: user.email,
					admin: user.admin,
					token: token,
				});
			});
		}
	} catch (err) {
		return res.status(500).json({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			detail: err.message,
		});
	}
};

// Controller for adding a favorite movie to user's favorites and increments given movie's number of likes
const addFavoriteMovie = async (req, res) => {
	try {
		const user = await userSchema.findById(req.body.id);
		const movie = await Movie.findById(req.body.movie_id);

		if (!movie) {
			return res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: 'Movie with given id could not be found',
			});
		}

		if (!user) {
			return res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: 'User with given id could not be found',
			});
		}

		// Check if favorites array is empty
		if (user.favorites.length === 0) {
			console.log('Entered');
			await user.favorites.push({ movieID: req.body.movie_id });
			await user.save();
			await movie.updateOne({ $inc: { likes: 1 } });

			return res.status(200).json({
				status: '200',
				type: 'Success',
				source: req.path,
				detail:
					'Movie added to user favorites and number of likes in given movie was incremented with 1',
			});
		}

		const movieExists = await userSchema.findOne({
			favorites: { $elemMatch: { movieID: req.body.movie_id } },
		});

		// // Check if movie already exists in user favorites
		if (movieExists) {
			return res.status(400).json({
				status: '400',
				type: 'Error',
				source: req.path,
				detail: "Movie has already been added to user's favorites",
			});
		}

		await user.favorites.push({ movieID: req.body.movie_id });
		await user.save();
		await movie.updateOne({ $inc: { likes: 1 } });

		return res.status(200).json({
			status: '200',
			type: 'Success',
			source: req.path,
			detail:
				'Movie added to user favorites and number of likes in given movie was incremented with 1',
		});
	} catch (err) {
		return res.status(200).json({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			detail: err.message,
		});
	}
};

module.exports = {
	updateUserRights,
	getUsers,
	getUser,
	register,
	login,
	addFavoriteMovie,
	forgotPassword,
	resetPassword,
};
