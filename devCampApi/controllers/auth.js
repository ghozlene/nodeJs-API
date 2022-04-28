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

	sendTokenResponse(user, 200, res);

	res.status(200).json({
		success: true,
		token,
	});
});

//@Description : Login User
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
	sendTokenResponse(user, 200, res);

	//creating a token
	const token = user.getSignedJwtToken();

	res.status(200).json({
		success: true,
		token,
	});
});

//get token from model,create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
	//creating a token
	const token = user.getSignedJwtToken();

	const options = {
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};

//@Description : Get the current User
//@Route: GET /auth/me
//Access : private

exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: user,
	});
});

//@Description : Forgot password
//@Route: POST /auth/forgotpassword
//Access : Public

exports.forgotpassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new ErrorResponse(
				`there is no user with the email :${req.body.email}`,
				404
			)
		);
	}

	//getting the reset token
	const resetToken = user.getResetPasswordToken();
	console.log(resetToken);
	await user.save({ validateBeforesave: false });
	res.status(200).json({
		success: true,
		data: user,
	});
});
