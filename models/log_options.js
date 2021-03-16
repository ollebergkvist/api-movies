// Module to create data object
// Conditions based on req.body params

const getCurrentDateAndTime = require('../models/date_time.js'); //  Get current date and time formatted

const setLoggingData = async (...queries) => {
	const currentDateAndTime = await getCurrentDateAndTime();
	const movieTitle = queries[0];
	const salesPrice = queries[1];
	const rentalPrice = queries[2];
	let salesPriceStringified;
	let rentalPriceStringified;

	let options = {};
	if (salesPrice) {
		salesPriceStringified = salesPrice.toString();
	}

	if (rentalPrice) {
		rentalPriceStringified = rentalPrice.toString();
	}

	if (movieTitle && !salesPrice && !rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie title update',
			title: movieTitle,
		};
	} else if (movieTitle && salesPrice && !rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie title and sales price update',
			title: movieTitle,
			sales_price: salesPriceStringified,
		};
	} else if (movieTitle && !salesPrice && rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie title and rental price update',
			title: movieTitle,
			rental_price: rentalPriceStringified,
		};
	} else if (movieTitle && salesPrice && rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie titel, sales and rental price update',
			title: movieTitle,
			sales_price: salesPriceStringified,
			rental_price: rentalPriceStringified,
		};
	} else if (!movieTitle && salesPrice && rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie sales and rental price update',
			sales_price: salesPriceStringified,
			rental_price: rentalPriceStringified,
		};
	} else if (!movieTitle && !salesPrice && rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie rental price update',
			rental_price: rentalPriceStringified,
		};
	} else if (!movieTitle && salesPrice && !rentalPrice) {
		options = {
			level: 'info',
			date: currentDateAndTime,
			type: 'Movie sales price update',
			sales_price: salesPriceStringified,
		};
	}

	return options;
};

module.exports = setLoggingData;
