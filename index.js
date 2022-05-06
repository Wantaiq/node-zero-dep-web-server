import fs from 'node:fs';
import http from 'node:http';

const port = 3000;
const ip = '127.0.0.1';

function handleResponse(response) {
  const readStream = fs.createReadStream('./public/index.html');
  readStream.pipe(response);
}

const server = http.createServer((req, res) => {
  console.log('Response url', res.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  handleResponse(res);
});

server.listen(port, ip, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listening on ${ip} port: ${port}`);
  }
});
