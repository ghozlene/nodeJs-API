const http = require('http');

const todos = [
	{ id: 1, text: 'todo one' },
	{ id: 2, text: 'todo two' },
	{ id: 3, text: 'todo three' },
];
const server = http.createServer((req, res) => {
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'X-Powered-By': 'Node.JS',
	});
	let body = [];
	req
		.on('data', (chunk) => {
			body.push(chunk);
		})
		.on('end', () => {
			body = Buffer.concat(body).toString();
			console.log(body);
		});
	res.end(
		JSON.stringify({
			success: true,
			data: todos,
		})
	);
	console.log(req.headers.authorization);
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
