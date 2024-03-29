const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geoCoder = require('../utils/geoCoder');
const path = require('path');
//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
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
	//Adding user to request body
	req.body.user = req.user.id;

	//Check for published bootcamp
	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

	if (publishedBootcamp && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user with ID ${req.user.id} has already published a bootcamp`,
				400
			)
		);
	} else {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	}
});

//@Description : PUT Single  bootcamp
//@Route: PUT /api/v1/bootcamps/:id
//@Access : Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	//verify if the user is the bootcamp Owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user ${req.user.name} with id ${bootcamp.user} is not authorized to update the bootcamp ${bootcamp.id}`,
				401
			)
		);
	}
	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

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
	//verify if the user is the bootcamp Owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user ${req.user.name} with id ${bootcamp.user} is not authorized to delete the bootcamp ${bootcamp.id}`,
				401
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

//@Description : UPDATE Single  bootcamp
//@Route: PUT/api/v1/bootcamps/:id/photo
//@Access : Private
exports.bootcampsPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	//verify if the user is the bootcamp Owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user ${req.user.name} with id ${bootcamp.user} is not authorized to delete the bootcamp ${bootcamp.id}`,
				401
			)
		);
	}
	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;
	//Making sure the img is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an img File `, 400));
	}
	//checking File Size
	if (file.size > process.env.File_Max_SIZE) {
		return next(
			new ErrorResponse(
				`Please upload an img File less then ${
					process.env.File_Max_SIZE / 1024
				}Mo `,
				400
			)
		);
	}
	//Create a custom Filename
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
	file.mv(`${process.env.File_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file uploading`, 500));
		}
		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});
