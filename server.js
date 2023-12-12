const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 3000;
http.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
