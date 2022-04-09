const Bootcamp = require('../models/Bootcamp');

//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			success: true,
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
			return res.status(400).json({
				success: false,
				data: { msg: 'Id is not define in your DB check your id on the URL' },
			});
		}
		res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			data: { msg: 'bad request you can check your request again' },
		});
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
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Change a bootcamp ${req.params.id}`,
	});
};

//@Description : DELETE Single  bootcamp
//@Route: DELETE /api/v1/bootcamps/:id
//@Access : Private
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Delete a bootcamp ${req.params.id}`,
	});
};
