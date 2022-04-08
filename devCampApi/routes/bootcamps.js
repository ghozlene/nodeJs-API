const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Show all bootcamps',
	});
});

router.get('/:id', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Show one bootcamp ${req.params.id}`,
	});
});

router.post('/', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Create new bootcamps',
	});
});
router.put('/:id', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Change a bootcamp ${req.params.id}`,
	});
});
router.delete('/:id', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Delete a bootcamp ${req.params.id}`,
	});
});

module.exports = router;
