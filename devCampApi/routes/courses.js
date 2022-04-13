const express = require('express');
const {
	getCourse,
	getSingleCourse,
	addCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourse).post(addCourse);
router.route('/:id').get(getSingleCourse);
module.exports = router;
