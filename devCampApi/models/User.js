const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: { type: String, required: [true, 'Please enter the name field'] },
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email',
		],
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
		select: false,
	},
	role: { type: String, enum: ['user', 'publisher'], default: 'user' },

	resetPassowrdToken: String,
	resetPasswordExperation: Date,
	createdAt: { type: Date, default: Date.now },
});

//Encrypt password using bcrypt

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
