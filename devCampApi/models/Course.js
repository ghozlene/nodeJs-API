const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add the title of the course'],
	},
	description: { type: String, required: [true, 'please add description'] },
	weeks: { type: String, required: [true, 'please add number of week'] },
	tuition: { type: Number, required: [true, 'please add tuition cost'] },
	minimumSkill: {
		type: String,
		required: [true, 'please add some minimumSkill'],
		enum: ['beginner', 'intermediate', 'advanced'],
	},
	scholarShipAvailable: { type: Boolean, default: false },
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

//static method to get Average of tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } },
		},
	]);
	try {
		console.log(`average is adding to the Bootcamp`.blue.inverse);
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (err) {
		console.log(err);
	}
};

//Calling getAverageCost after save Course
CourseSchema.post('save', function () {
	this.constructor.getAverageCost(this.bootcamp);
});
//Calling getAverageCost before deleting Course
CourseSchema.pre('remove', function () {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
