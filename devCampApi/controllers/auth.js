const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const path = require('path');

//@Description : Register User
//@Route: POST /api/v1/auth/register
//Access : Public

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	//creating user:
	const user = await User.create({
		name,
		email,
		password,
		role,
	});
	//creating a token
	const token = user.getSignedJwtToken();
	res.status(200).json({
		success: true,
		token,
	});
});

//@Description : Register User
//@Route: POST /api/v1/auth/login
//Access : Public

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//Validating the email and the password
	if (!email || !password) {
		return next(
			new ErrorResponse(`Please provide an email and a password `, 400)
		);
	}

	//Check for user

	const user = await User.findOne({ email: email }).select('+password');

	if (!user) {
		return next(new ErrorResponse(`invalid credentials`, 401));
	}
	//check if password matches
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return next(new ErrorResponse(`invalid credentials`, 401));
	}

	//creating a token
	const token = user.getSignedJwtToken();
	res.status(200).json({
		success: true,
		token,
	});
});
