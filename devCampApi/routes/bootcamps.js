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

//include other resource routers
const courseRouter = require('./courses');

const router = express.Router();
//Re-routing to the resource routers(courseRouter)
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/:id/photo').put(bootcampsPhotoUpload);
router
	.route('/:id')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
