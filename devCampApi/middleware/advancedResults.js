const advancedResults = (model, populate) => async (req, res, next) => {
	let query;
	//coping the req.query into reqQuery with the spread op
	const reqQuery = { ...req.query };

	//creating fields to exclude from the the query
	const removeFields = ['select', 'sort', 'page', 'limit'];
	//looping through removeField and deleting them from request query
	removeFields.forEach((params) => delete reqQuery[params]);

	console.log(reqQuery);

	//creating query string
	let queryStr = JSON.stringify(reqQuery);

	//creating operators like greater then($gt) etc
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);
	query = model.find(JSON.parse(queryStr));

	//selecting fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}
	//sorting our request
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	//pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const starIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const totalDoc = await model.countDocuments();

	query = query.skip(starIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	//executing the query
	const results = await query;

	//the result of the pagination :
	const pagination = {};
	if (endIndex < totalDoc) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (starIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}
	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};
	next();
};

module.exports = advancedResults;
