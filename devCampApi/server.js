const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bootcamps = require('./routes/bootcamps');
//Loads .env file contents into process.env.
dotenv.config({
	path: path.resolve(__dirname, './config/config.env'),
});

const app = express();

app.use('/api/v1/bootcamps', bootcamps);

console.log(process.env.PORT);
PORT = process.env.PORT;

app.listen(
	PORT,
	console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`)
);
