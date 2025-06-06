const http = require('node:http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log('request received:', req.method, req.url);
  res.end('Hello, World!');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});