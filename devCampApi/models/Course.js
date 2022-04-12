const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add the title of the course'],
	},
	description: { type: String, required: [true, 'please add description'] },
	weeks: { type: String, required: [true, 'please add number of week'] },
	tuition: { type: String, required: [true, 'please add tuition cost'] },
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
});

module.exports = mongoose.model('Course', CourseSchema);
