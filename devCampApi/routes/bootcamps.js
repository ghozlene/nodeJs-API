const express = require('express');
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	bootcampsPhotoUpload,
	getBootcampsInRadius,
} = require('../controllers/bootcamps');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

//include other resource routers
const courseRouter = require('./courses');

const router = express.Router();
const { protect } = require('../middleware/auth');

//Re-routing to the resource routers(courseRouter)
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, createBootcamp);

router.route('/:id/photo').put(protect, bootcampsPhotoUpload);
router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, updateBootcamp)
	.delete(protect, deleteBootcamp);

module.exports = router;
