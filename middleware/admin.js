module.exports = function (req, res, next) {
	if (req.user.admin !== 'admin') {
		res.status(401).send({
			type: 'Error',
			source: req.url,
			title: 'Authorization error',
			detail: 'User lacks admin rights',
		});
	} else {
		next();
	}
};
