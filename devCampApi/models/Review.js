const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add the title of the Review'],
		maxlength: 100,
	},
	text: { type: String, required: [true, 'please add some text'] },
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, 'please add a rating between 1..10'],
	},

	createdAt: { type: Date, default: Date.now },
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

//Preventing user from submiting more then one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
