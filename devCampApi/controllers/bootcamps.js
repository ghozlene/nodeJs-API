const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geoCoder = require('../utils/geoCoder');

//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
	query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

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
	const totalDoc = await Bootcamp.countDocuments();

	query = query.skip(starIndex).limit(limit);

	//executing the query
	const bootcamps = await query;

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

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
		pagination,
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
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}

	//this remove method will trigger the middleware
	bootcamp.remove();

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
