const geoCoder = require('node-geocoder');
const keys = require('../constants/constant');

const options = {
	provider: keys.GEOCODER_PROVIDER,
	httpAdapter: 'https',
	apiKey: keys.GEOCODER_API_KEY,
	formatter: null,
};

const geocoder = geoCoder(options);

module.exports = geocoder;
