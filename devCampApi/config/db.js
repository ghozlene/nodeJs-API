const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
	const connect = await mongoose.connect(process.env.MONGO_URI);
	console.log(`mongoDB connected:${connect.connection.host}`.bold.blue);
};

module.exports = connectDB;
