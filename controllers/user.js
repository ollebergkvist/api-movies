// User controller
// Handles db logic

const bcrypt = require('bcryptjs'); // Password-hashing module
const jwt = require('jsonwebtoken'); // Create and valide JWT
const userSchema = require('../schemas/user.js'); // User mongoose schema
const Movie = require('../schemas/movie.js'); // Movie mongoose schema
const randomToken = require('random-token');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-sendgrid-transport');
const sendEmail = require('../models/send_email.js');

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
	const path = req.path;
	const result = res;

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
		// Declares new user schema
		const newUser = new userSchema({
			email: req.body.email,
			password: hashedPassword,
			admin: req.body.admin,
			verificationCode: randomToken(16),
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

			// Auth for send grid transport
			const options = {
				auth: {
					api_key: process.env.SENDGRID_API,
				},
			};

			// SMTP setup
			const transport = nodemailer.createTransport(smtpTransport(options));

			// Message
			const message = {
				to: newUser.email,
				from: 'hello@ollebergkvist.com',
				subject: 'Email confirmation',
				text:
					'Click:\n\n' +
					'https://api-movies-ollebergkvist.herokuapp.com/api/reset/' +
					newUser.verificationCode +
					'\n\n' +
					'here to verify your email. Thank you.\n',
			};

			// Sends email
			await transport.sendMail(message, (error, result) => {
				if (error) {
					return res.status(400).send({
						status: '400',
						type: 'Error',
						source: path,
						title: 'SendGrid error',
						detail: error,
					});
				} else {
					return res.status(201).send({
						status: '201',
						type: 'Success',
						source: req.path,
						detail: 'Registration succeeded',
					});
				}
			});
		}
	} catch (err) {
		// Returns status and body
		return res.status(500).send({
			status: '500',
			type: 'Error',
			source: req.path,
			title: 'Database error',
			message: err.message,
		});
	}
};

// Controller for verify
const verify = async (req, res) => {
	try {
		const { verificationCode } = req.params;

		// Try to find a user with given email
		const user = await userSchema.findOne({
			verificationCode: verificationCode,
		});

		// Error handling if a user with given email was not found
		if (!user) {
			res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Authorization error',
				detail: 'String could not be validated.',
			});
		} else {
			user.isActivated = true;
			user.verificationCode = undefined;
			await user.save();

			return res.status(201).send({
				status: '201',
				type: 'Success',
				source: req.path,
				detail: 'Account successfully activated',
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

			// Auth for send grid transport
			const options = {
				auth: {
					api_key: process.env.SENDGRID_API,
				},
			};

			// SMTP setup
			const transport = nodemailer.createTransport(smtpTransport(options));

			// Message
			const message = {
				to: user.email,
				from: 'hello@ollebergkvist.com',
				subject: 'API-Movies Password Reset',
				text:
					'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'https://api-movies-ollebergkvist.herokuapp.com/api/reset/' +
					token +
					'\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n',
			};

			// Sends email
			await transport.sendMail(message, (error, result) => {
				if (error) {
					res.status(400).send({
						status: '400',
						type: 'Error',
						source: req.path,
						title: 'SendGrid error',
						detail: error,
					});
				} else {
					res.status(201).send({
						status: '201',
						type: 'Success',
						source: req.path,
						detail: 'Email to reset password successfully sent',
					});
				}
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

const resetPassword = async (req, res) => {
	try {
		// Try to find a user with given email
		const user = await userSchema.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		// Error handling if a user with given email was not found
		if (!user) {
			res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Authorization error',
				detail: 'Password reset token is invalid or has expired',
			});
		} else {
			// Number of salt rounds
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

			// Saves new password and resets token and expiry
			user.password = hashedPassword;
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();

			// Auth for send grid transport
			const options = {
				auth: {
					api_key: process.env.SENDGRID_API,
				},
			};

			// SMTP setup
			const transport = nodemailer.createTransport(smtpTransport(options));

			// Message
			const message = {
				to: user.email,
				from: 'hello@ollebergkvist.com',
				subject: 'Your password has been changed',
				text:
					'Hello,\n\n' +
					'This is a confirmation that the password for your account ' +
					user.email +
					' has just been changed.\n',
			};

			// Sends email
			await transport.sendMail(message, (error, result) => {
				if (error) {
					res.status(400).send({
						status: '400',
						type: 'Error',
						source: req.path,
						title: 'SendGrid error',
						detail: error,
					});
				} else {
					res.status(201).send({
						status: '201',
						type: 'Success',
						source: req.path,
						detail: 'Password successfully updated',
					});
				}
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

const reset = async (req, res) => {
	try {
		// Try to find a user with given email
		const user = await userSchema.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		// Error handling if a user with given email was not found
		if (!user) {
			res.status(400).send({
				status: '400',
				type: 'Error',
				source: req.path,
				title: 'Authorization error',
				detail: 'Password reset token is invalid or has expired',
			});
		} else {
			res.render('reset', {
				user: req.user,
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
	reset,
	verify,
};
