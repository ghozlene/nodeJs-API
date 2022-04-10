const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();
	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

//@Description : GET Single  bootcamp
//@Route: GET /api/v1/bootcamps/:id
//@Access : Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

//@Description : POST Single  bootcamp
//@Route: PUT /api/v1/bootcamps
//@Access : Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

//@Description : PUT Single  bootcamp
//@Route: PUT /api/v1/bootcamps/:id
//@Access : Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

//@Description : DELETE Single  bootcamp
//@Route: DELETE /api/v1/bootcamps/:id
//@Access : Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		data: {},
		msg: 'the item is deleting with success',
	});
});
