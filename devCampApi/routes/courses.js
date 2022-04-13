const express = require('express');
const {
	getCourse,
	getSingleCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourse).post(addCourse);
router
	.route('/:id')
	.get(getSingleCourse)
	.put(updateCourse)
	.delete(deleteCourse);
module.exports = router;
