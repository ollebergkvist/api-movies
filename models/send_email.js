// Module to send email
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-sendgrid-transport');

const sendEmail = async (email, verificationCode, path, res) => {
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
			verificationCode +
			'\n\n' +
			'here to verify your email. Thank you.\n',
	};

	// Sends email
	await transport.sendMail(message, (error, result) => {
		if (error) {
			return false;
		} else {
			return true;
		}
	});
};

module.exports = sendEmail;
