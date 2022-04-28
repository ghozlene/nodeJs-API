const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({
	path: path.resolve(__dirname, './config.env'),
});

const mongoose = require('mongoose');
const colors = require('colors');
const keys = require('./constants/constant');

//loading model bootcamp
const Bootcamp = require('./models/Bootcamp');
//loading model Course
const Course = require('./models/Course');
const User = require('./models/User');

//connecting to DB
mongoose.connect(keys.MONGO_URI);

//reading JSON file
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

//Reading JSON file of Course
const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

//Reading JSON file of User
const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

//importing data to the DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		console.log(`data has been imported`.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`Error detected: ${error}`);
	}
};

//deleting data from DB

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		console.log(`data has been deleted`.red.inverse.underline);
		process.exit(1);
	} catch (error) {
		console.error(`Error detected: ${error}`);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
