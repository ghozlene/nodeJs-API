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

//static method to get Average Rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: { _id: '$bootcamp', averageRating: { $avg: '$rating' } },
		},
	]);
	try {
		console.log(`average Rating is adding to the Bootcamp`.yellow.inverse);
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageRating,
		});
	} catch (err) {
		console.log(err);
	}
};

//Calling getAverageCost after save Course
ReviewSchema.post('save', function () {
	this.constructor.getAverageRating(this.bootcamp);
});
//Calling getAverageCost before deleting Course
ReviewSchema.pre('remove', function () {
	this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
