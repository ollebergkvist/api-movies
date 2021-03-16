const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

// Password requirements
const complexityOptions = {
	min: 8,
	max: 20,
	lowerCase: 1,
	upperCase: 1,
	numeric: 1,
	symbol: 1,
	requirementCount: 4,
};

const schemas = {
	id: Joi.object({
		id: Joi.string().required(),
	}),
	favorite: Joi.object({
		id: Joi.string().required(),
		movie_id: Joi.string().required(),
	}),
	create: Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		stock: Joi.number().required(),
		rental_price: Joi.number().required(),
		sales_price: Joi.number().required(),
		availability: Joi.string().required(),
		image: Joi.string(),
	}),
	put: Joi.object({
		title: Joi.string(),
		description: Joi.string(),
		stock: Joi.number(),
		rental_price: Joi.number(),
		sales_price: Joi.number(),
		availability: Joi.boolean(),
	}).min(1),
	search: Joi.object({
		title: Joi.string().required(),
	}),
	rent: Joi.object({
		movie_id: Joi.string().required(),
		customer_id: Joi.string().required(),
		amount: Joi.number().required(),
		cost: Joi.number().required(),
	}),
	purchase: Joi.object({
		movie_id: Joi.string().required(),
		customer_id: Joi.string().required(),
		amount: Joi.number().required(),
		cost: Joi.number().required(),
	}),
	register: Joi.object({
		email: Joi.string().email().required(),
		password: passwordComplexity(complexityOptions).required(),
		admin: Joi.string(),
	}),
	login: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
	updateUser: Joi.object({
		admin: Joi.string().required(),
	}),
};
module.exports = schemas;
