const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  console.log('request received:', req.method, req.url);
  res.end('Hello, World!');
});

app.post('/pokemon', (req, res) => {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString(); // Convert Buffer to string
  });

  req.on('end', () => {
    console.log('Received data:', body);
    const jsonData = JSON.parse(body);
    jsonData.timestamp = new Date().toISOString();
    res.status(201).json(jsonData);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});