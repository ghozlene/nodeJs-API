const colors = require('colors');
const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;
	//log to console for dev
	console.log(`${err.stack}`.red);

	//for bad objectId
	if (err.name === 'CastError') {
		const messsage = `The Resource is not found verify the id ${err.value}`;
		error = new ErrorResponse(messsage, 404);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'server error',
	});
};

module.exports = errorHandler;
