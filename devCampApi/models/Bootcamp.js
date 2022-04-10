const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geoCoder');
const Schema = require('mongoose').Schema;

const BootcampSchema = new Schema({
	name: {
		type: String,
		required: [true, 'please enter a name'],
		unique: true,
		trim: true,
		maxlength: [50, 'name can not be more then 50  characters'],
	},
	slug: { type: String },
	description: {
		type: String,
		required: [true, 'please enter some description'],
		maxlength: [500, 'Description can not be over 500 characters'],
	},

	//using regax url :https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Please use a valid URL with HTTP or HTTPS',
		],
	},
	phone: {
		type: String,
		maxlength: [20, 'Phone number can not be longer than 20 characters'],
	},
	email: {
		type: String,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email',
		],
	},
	address: {
		type: String,
		required: [true, 'Please add an address'],
	},
	location: {
		// GeoJSON Point
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ['Point'], // 'location.type' must be 'Point'
		},
		coordinates: {
			type: [Number],
			index: '2dsphere',
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String,
	},
	careers: {
		// Array of strings
		type: [String],
		required: true,
		enum: [
			'Web Development',
			'Mobile Development',
			'UI/UX',
			'Data Science',
			'Business',
			'Other',
		],
	},
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at least 1'],
		max: [10, 'Rating must can not be more than 10'],
	},
	averageCost: Number,
	photo: {
		type: String,
		default: 'no-photo.jpg',
	},
	housing: {
		type: Boolean,
		default: false,
	},
	jobAssistance: {
		type: Boolean,
		default: false,
	},
	jobGuarantee: {
		type: Boolean,
		default: false,
	},
	acceptGi: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

//Creating  bootcamp slug from name

BootcampSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

//GeoCode && creating a location field

BootcampSchema.pre('save', async function (next) {
	const location = await geocoder.geocode(this.address);
	this.location = {
		type: 'Point',
		coordinates: [location[0].latitude, location[0].longitude],
		formattedAddress: location[0].formattedAddress,
		street: location[0].streetName,
		city: location[0].city,
		state: location[0].stateCode,
		zipcode: location[0].zipcode,
		country: location[0].countryCode,
	};
	//to make the adr not available in the DB
	this.address = undefined;
	next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
