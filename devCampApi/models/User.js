const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//signing JWT
userSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

//check if the password entred equale to the hash password stored in BD
userSchema.methods.matchPassword = async function (entredPassword) {
	return await bcrypt.compare(entredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};
//Generating and hashing password token
userSchema.methods.getResetPasswordToken = function () {
	//generating token
	const resetToken = crypto.randomBytes(20).toString('hex');

	//hashing the token and set to resetPasswordToken field
	this.resetPassowrdToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	//setting the experation date

	this.resetPasswordExperation = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
