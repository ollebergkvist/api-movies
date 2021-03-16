const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports = async function (req, res, next) {
	const token = req.headers['x-access-token'];

	if (!token)
		return res.status(401).json({
			type: 'Error',
			source: req.path,
			title: 'Authorization error',
			detail: 'No token provided in request headers',
		});

	try {
		const decodedToken = jwt.verify(token, secret);
		const user = await decodedToken;
		req.user = user;

		next();
	} catch (err) {
		res.status(401).send({
			type: 'Error',
			source: req.path,
			title: 'Authorization error',
			detail: err.message,
		});
	}
};
