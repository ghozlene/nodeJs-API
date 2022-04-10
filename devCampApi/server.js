const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
//Loads .env file contents into process.env.
dotenv.config({
	path: path.resolve(__dirname, './config.env'),
});

const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');

//for middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(express.json());

//this is a custom logger create by me
app.use(logger);

//this is a logger for development env
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);
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
