const express = require('express');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const path = require('path');
//Loads .env file contents into process.env.
dotenv.config({
	path: path.resolve(__dirname, './config.env'),
});

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const colors = require('colors');

//for middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(express.json());

//Cookie parser
app.use(cookieParser());

//this is a custom logger create by me
app.use(logger);

//this is a logger for development env
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//file uploading
app.use(fileupload());

//  sanitize data that only contains $, without .(dot)
// Can be useful for letting data pass that is meant for querying nested documents.
app.use(
	mongoSanitize({
		allowDots: true,
	})
);

//set security headers
app.use(helmet());

//set cross sites scripting:
app.use(xss());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use(errorHandler);
PORT = process.env.PORT;

const server = app.listen(
	PORT,
	console.log(
		`server running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold.italic
	)
);

//handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error:(${err.message})`.red.underline);

	//close the server && exsit process
	server.close(() => process.exit(1));
});
