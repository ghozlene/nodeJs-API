const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			data: { msg: 'bad request you can check your url' },
		});
	}
};

//@Description : GET Single  bootcamp
//@Route: GET /api/v1/bootcamps/:id
//@Access : Public
exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			);
		}
		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		// res.status(400).json({
		// 	success: false,
		// 	data: { msg: 'bad request you can check your request again' },
		// });
		next(
			new ErrorResponse(
				`The bootcamp is not found verify the id ${req.params.id}`,
				404
			)
		);
	}
};

//@Description : POST Single  bootcamp
//@Route: PUT /api/v1/bootcamps
//@Access : Private
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			data: {
				msg: 'bad request you just want to add the same piece with the same info',
			},
		});
	}
};

//@Description : PUT Single  bootcamp
//@Route: PUT /api/v1/bootcamps/:id
//@Access : Private
exports.updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!bootcamp) {
			return res.status(400).json({
				success: false,
				data: { msg: 'Bad request ,something goes worng' },
			});
		}
		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: 'something goes wrong',
		});
	}
};

//@Description : DELETE Single  bootcamp
//@Route: DELETE /api/v1/bootcamps/:id
//@Access : Private
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
		if (!bootcamp) {
			return res.status(400).json({
				success: false,
				data: { msg: 'Bad request ,something goes worng' },
			});
		}
		res.status(200).json({
			success: true,
			data: {},
			msg: 'the item is deleting with success',
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			msg: 'something goes wrong',
		});
	}
};
