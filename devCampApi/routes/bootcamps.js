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

const Bootcamp = require('../models/Bootcamp');

//include other resource routers
const courseRouter = require('./courses');

const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Re-routing to the resource routers(courseRouter)
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampsPhotoUpload);
router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
