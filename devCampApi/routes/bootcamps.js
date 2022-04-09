const express = require('express');
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require('../controllers/bootcamps');
const router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamp);
router
	.route('/:id')
	.get(updateBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
