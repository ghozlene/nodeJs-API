const http = require('http');

const server = http.createServer((req, res) => {
	console.log(req.method);
	res.end();
});

const PORT = 5000;
server.listen(PORT, () => `Server listen on port ${PORT}`);
