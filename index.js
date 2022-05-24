import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const port = 3000;
const ip = '127.0.0.1';

function handleResponse(request, response) {
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
  let filePath = request.url.slice(1);
  const fileExtension = path.extname(request.url.toString());
  const contentType = { 'Content-Type': type[fileExtension] };

  // setting the default page
  if (!filePath || filePath === 'index.html') {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/index.html`;
  }

  if (filePath === 'favicon.ico') {
    filePath = './public/favicon.ico';
  }
  if (filePath === 'index.css') {
    filePath = `./public/index.css`;
  }
  if (filePath === 'memes' || filePath === 'memes/index.htm') {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/memes/index.htm`;
  }

  if (!contentType['Content-Type']) {
    contentType['Content-Type'] = 'text/html';
    filePath = './err-page.html';
  }

  console.log(contentType);
  const readStream = fs.createReadStream(filePath); // Reading the requested file
  response.writeHead(200, contentType); // "Data description"
  readStream
    .on('error', (err) => {
      // readStream err handling
      if (err.code === 'ENOENT') {
        const errReadStream = fs.createReadStream('./err-page.html');
        response.writeHead(404, { 'Content-Type': 'text/html' });
        errReadStream.pipe(response);
      }
    })
    .pipe(response); // Displaying the data
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
