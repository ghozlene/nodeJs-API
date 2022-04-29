const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

//@Description : GET all users
//@Route: GET /api/v1/auth/users
//Access : Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

//@Description : GET single user
//@Route: GET /api/v1/auth/users/:id
//Access : Private/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

//@Description : CREATE single user
//@Route: POST /api/v1/auth/users
//Access : Private/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({
		success: true,
		data: user,
	});
});

//@Description : UPDATE single user
//@Route: POST /api/v1/auth/users/:id
//Access : Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

//@Description : DELETE single user
//@Route: POST /api/v1/auth/users/:id
//Access : Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
	await User.findByIdAndRemove(req.params.id);

	res.status(200).json({
		success: true,
		data: {},
	});
});
