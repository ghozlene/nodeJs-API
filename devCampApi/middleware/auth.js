const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const colors = require('colors');

//Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		//setting token from Bearer token in headers
		token = req.headers.authorization.split(' ')[1];

		//setting token from cookie
	} //  else if (req.cookies.token) {
	// 	token = req.cookies.token;
	// }

	//making sure that the token exists
	if (!token) {
		return next(
			new ErrorResponse('Not authorize to access to this route', 401)
		);
	}
	try {
		//verifying the token

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded) {
			console.log(decoded);
			req.user = await User.findById(decoded.id);
			next();
		} else {
			return next(
				new ErrorResponse('Not authorize to access to this route', 401)
			);
		}
	} catch (error) {
		return next(
			new ErrorResponse('Not authorize to access to this route', 401)
		);
	}
});

//granting access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`user with this Role : (${req.user.role}) is not authorize`,
					403
				)
			);
		}
		next();
	};
};
