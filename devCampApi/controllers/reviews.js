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

//@Description : GET single review
//@Route: GET /api/v1/reviews/:id
//Access : Public
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
