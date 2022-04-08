const http = require('http');

const todos = [
	{ id: 1, text: 'todo one' },
	{ id: 2, text: 'todo two' },
	{ id: 3, text: 'todo three' },
];
const server = http.createServer((req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('X-Powered-By', 'Node.JS');

	res.end(
		JSON.stringify({
			success: true,
			data: todos,
		})
	);
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
