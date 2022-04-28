const express = require('express');
const {
	getCourse,
	getSingleCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourse
	)
	.post(protect, addCourse);
router
	.route('/:id')
	.get(getSingleCourse)
	.put(protect, updateCourse)
	.delete(protect, deleteCourse);
module.exports = router;
