const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

//@Description : GET reviews
//@Route: GET /api/v1/reviews
//@Route: GET /api/v1/bootcamps/:bootcampId/reviews
//Access : Public
exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });

		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

//@Description : Add a review
//@Route: POST /api/v1/bootcamps/:bootcampsId/reviews
//Access : Private
exports.getSingleReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!review) {
		return next(
			new ErrorResponse(`No review found with this id :${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: review,
	});
});

//@Description : Add a review
//@Route: POST /api/v1/bootcamps/:bootcampsId/reviews
//Access : Private
exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`the bootcamp with id :${req.params.bootcampId} not found`
			),
			404
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		data: review,
	});
});