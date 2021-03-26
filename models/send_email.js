// Module to send email
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-sendgrid-transport');

const sendEmail = async (email, uniqueString) => {
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
		to: email,
		from: 'hello@ollebergkvist.com',
		subject: 'Email confirmation',
		text:
			'Click:\n\n' +
			'https://api-movies-ollebergkvist.herokuapp.com/api/reset/' +
			uniqueString +
			'\n\n' +
			'here to verify your email. Thank you.\n',
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
};

module.exports = sendEmail;
