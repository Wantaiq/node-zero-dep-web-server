import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const port = 3000;
const ip = '127.0.0.1';

function handleResponse(request, response) {
  console.log(request.url);
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
  // let filePath = `./public${request.url}`; default public dir
  let filePath = request.url.slice(1);
  const fileExtension = path.extname(request.url.toString());
  const contentType = { 'Content-Type': type[fileExtension] };

  // setting the default page
  if (
    request.url === '/' ||
    request.url === '/public/' ||
    request.url === '/public'
  ) {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/index.html`;
  }

  if (request.url === '/favicon.ico') {
    filePath = './public/favicon.ico';
  }
  if (request.url === '/public/memes') {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/memes/index.htm`;
  }

  if (!request.url.startsWith('/public') || !contentType['Content-Type']) {
    contentType['Content-Type'] = 'text/html';
    filePath = './err-page.html';
  }

  response.writeHead(200, contentType); // "Data description"
  const readStream = fs.createReadStream(filePath); // Reading the requested file
  readStream
    .on('error', (err) => {
      // readStream err handling
      if (err.code === 'ENOENT') {
        const createErrReadStream = fs.createReadStream('./err-page.html');
        response.writeHead(404, { 'Content-Type': 'text/html' });
        createErrReadStream.pipe(response);
      }
    })
    .pipe(response); // Displaying the data
  response.end();
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
