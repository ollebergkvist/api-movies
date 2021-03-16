// Module to set options for the pagination method
// Conditions based on req.body params

const setPaginationOptions = async (...queries) => {
	const queryPage = queries[0];
	const querySort = queries[1];
	const queryLimit = queries[2];
	let options = {};

	if (!querySort && !queryLimit && !queryPage) {
		options = {};
	} else if (querySort && !queryLimit && !queryPage) {
		options = {
			sort: querySort,
		};
	} else if (!querySort && queryLimit && !queryPage) {
		options = {
			limit: queryLimit,
		};
	} else if (!querySort && !queryLimit && queryPage) {
		options = {
			page: queryPage,
		};
	} else if (querySort && queryLimit && !queryPage) {
		options = {
			sort: querySort,
			limit: queryLimit,
		};
	} else if (querySort && !queryLimit && queryPage) {
		options = {
			sort: querySort,
			page: queryPage,
		};
	} else if (!querySort && queryLimit && queryPage) {
		options = {
			limit: queryLimit,
			page: queryPage,
		};
	} else {
		options = {
			sort: querySort,
			limit: queryLimit,
			page: queryPage,
		};
	}
	return options;
};

module.exports = setPaginationOptions;
