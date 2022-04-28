const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Bootcamp = require('../models/Bootcamp');

//@Description : GET all Courses
//@Route: GET /api/v1/courses
//@Route: GET /api/v1/bootcamps/:bootcampId/courses
//Access : Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });

		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
	const courses = await query;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});

//@Description : GET single course
//@Route: GET /api/v1/courses/:id
//Access : Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!course) {
		return next(
			new ErrorResponse(
				`course not found check the id of:${req.params.id}`,
				404
			)
		);
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

//@Description :  add course
//@Route: POST /api/v1/boocamps/boocampId/courses
//Access : Private
exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	req.body.user = req.user.id;
	console.log(req.body.user);
	const bootcamp = await Bootcamp.findById(req.params.bootcampId);
	if (!bootcamp) {
		next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.bootcampId}`,
				404
			)
		);
	}

	//verify if the user is the course Owner
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user ${req.user.name} with id ${bootcamp.user} is not authorized to add a course to the bootcamp: ${bootcamp.id}`,
				401
			)
		);
	}
	const course = await Course.create(req.body);
	console.log(
		`course has been added to the bootcamp (id): ${req.params.bootcampId}`.green
			.inverse
	);
	res.status(200).json({
		success: true,
		data: course,
	});
});

//@Description : Update Single course
//@Route: PUT /api/v1/courses/:id
//@Access : Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);
	if (!course) {
		next(
			new ErrorResponse(
				`The course is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	//verify if the user is the course Owner

	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user ${req.user.name} not authorized to update course id :${course._id}`,
				401
			)
		);
	}
	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	console.log(`course Has been Updated with success`.bgMagenta);
	res.status(200).json({
		success: true,
		data: course,
	});
});

//@Description : delete Single course
//@Route: DELETE /api/v1/courses/:id
//@Access : Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);
	if (!course) {
		next(
			new ErrorResponse(
				`The course is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
	//verify if the user is the course Owner
	if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`the user ${req.user.name} not authorized to delete course id :${course._id}`,
				401
			)
		);
	}
	await course.remove();
	console.log(`course Has been removed with success`.bgRed);
	res.status(200).json({
		success: true,
		data: {},
	});
});
