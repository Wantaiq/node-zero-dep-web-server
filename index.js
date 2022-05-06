import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const port = 3000;
const ip = '127.0.0.1';

function handleResponse(request, response) {
  const fileExtension = path.extname(request.url.toString());
  console.log(request.url);
  console.log(fileExtension);
  const type = {
    '.css': 'text/css',
    '.git': 'image/gif',
    '.htm': 'text/html',
    '.html': 'text/html',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
  };
  const contentType = { 'Content-Type': type[fileExtension] };
  let filePath = `./public${request.url}`;

  // setting the default page
  if (request.url === '/') {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/index.html`;
  }

  response.writeHead(200, contentType); // "Data description"
  const readStream = fs.createReadStream(filePath); // Reading the requested file
  readStream.pipe(response); // Forwarding the data to the user.
}

// Creating server
const server = http.createServer((req, res) => {
  handleResponse(req, res);
});

server.listen(port, ip, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listening on ${ip} port: ${port}`);
  }
});
