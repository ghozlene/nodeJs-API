const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');

const logger = require('./middleware/logger');

//Loads .env file contents into process.env.
dotenv.config({
	path: path.resolve(__dirname, './config/config.env'),
});

const app = express();

//this is a custom logger create by me
app.use(logger);

//this is a logger for development env
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

console.log(process.env.PORT);
PORT = process.env.PORT;

app.listen(
	PORT,
	console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`)
);
