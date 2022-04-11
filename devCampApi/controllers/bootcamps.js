const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geoCoder = require('../utils/geoCoder');
//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;
	let queryStr = JSON.stringify(req.query);
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	query = JSON.parse(queryStr);

	const bootcamps = await Bootcamp.find(query);
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

//@Description : GET bootcamp within a radius
//@Route: DELETE /api/v1/bootcamps/radius/:zipcode/:distance(with Kilometre)
//@Access : Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	//get latitude/langitude from geocoder
	const loc = await geoCoder.geocode(zipcode);
	console.log(loc);
	const lat = loc[0].latitude;
	const lang = loc[0].longitude;

	//calculating Radius using radians unit
	//dividing the distance by the radius of the earth
	//earth Radius is about 6,371 km (google)

	const radius = distance / 6371;
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: { $centerSphere: [[lat, lang], radius] },
		},
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});
