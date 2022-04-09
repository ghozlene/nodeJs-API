//@Description: logs requests to console
const logger = (req, res, next) => {
	req.hello = 'hello Ghozlene';
	console.log(
		`${req.method}  ${req.protocol}://${req.get('host')}${req.originalUrl}`
	);

	console.log('*********************************');
	next();
};

module.exports = logger;
