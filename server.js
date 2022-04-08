const http = require('http');

const todos = [
	{ id: 1, text: 'todo one' },
	{ id: 2, text: 'todo two' },
	{ id: 3, text: 'todo three' },
];
const server = http.createServer((req, res) => {
	res.writeHead(404, {
		'Content-Type': 'application/json',
		'X-Powered-By': 'Node.JS',
	});
	res.end(
		JSON.stringify({
			success: false,
			errror: 'Page Not Found',
			data: null,
		})
	);
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
