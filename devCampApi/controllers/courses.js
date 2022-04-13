const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

//@Description : GET all Courses
//@Route: GET /api/v1/courses
//@Route: GET /api/v1/bootcamps/:bootcampId/courses
//Access : Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	let query;
	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		query = Course.find();
	}
	const courses = await query;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});
