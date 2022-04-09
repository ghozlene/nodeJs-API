//@Description : GET all the bootcamps
//@Route: GET /api/v1/bootcamps
//Access : Public
exports.getBootcamps = (req, res, next) => {
	console.log(`${req.hello} from GetBootcamps`);
	res.status(200).json({
		success: true,
		msg: 'Show all bootcamps',
		hello: req.hello,
	});
};

//@Description : GET Single  bootcamp
//@Route: GET /api/v1/bootcamps/:id
//@Access : Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Show one bootcamp ${req.params.id}`,
	});
};

//@Description : POST Single  bootcamp
//@Route: PUT /api/v1/bootcamps
//@Access : Private
exports.createBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Create new bootcamps',
	});
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
