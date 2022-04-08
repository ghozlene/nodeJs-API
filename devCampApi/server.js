const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
//Loads .env file contents into process.env.
dotenv.config({
	path: path.resolve(__dirname, './config/config.env'),
});

const app = express();

app.get('/api/v1/bootcamps', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Show all bootcamps',
	});
});

app.get('/api/v1/bootcamps/:id', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Show one bootcamp ${req.params.id}`,
	});
});

app.post('/api/v1/bootcamps', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'Create new bootcamps',
	});
});
app.put('/api/v1/bootcamps/:id', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Change a bootcamp ${req.params.id}`,
	});
});
app.delete('/api/v1/bootcamps/:id', (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `Delete a bootcamp ${req.params.id}`,
	});
});
console.log(process.env.PORT);
PORT = process.env.PORT;

app.listen(
	PORT,
	console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`)
);
