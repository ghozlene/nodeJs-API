const colors = require('colors');
const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;
	console.log(err.message);
	//log to console for dev
	console.log(`${err.stack}`.red);

	//for bad objectId
	if (err.name === 'CastError') {
		const messsage = `The Resource is not found verify the id ${err.value}`;
		error = new ErrorResponse(messsage, 404);
	}
	//Mongoose Duplicated Key
	if (err.code === 11000) {
		const message = `Duplicate field value entred (${req.body.name}) `;
		error = new ErrorResponse(message, 400);
	}
	//mongoose Validation errors
	if ((err.name = 'ValidationError')) {
		const message = Object.values(err.errors).map((value) => value.message);

		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'server error',
	});
};

module.exports = errorHandler;
