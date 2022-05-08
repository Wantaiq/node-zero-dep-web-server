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

  console.log(contentType);
  console.log(filePath);
  // setting the default page
  if (!filePath || filePath === 'public/' || filePath === 'public') {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/index.html`;
  }

  if (filePath === 'favicon.ico') {
    filePath = './public/favicon.ico';
  }
  if (filePath === 'public/memes') {
    contentType['Content-Type'] = 'text/html';
    filePath = `./public/memes/index.htm`;
  }

  if (!contentType['Content-Type']) {
    contentType['Content-Type'] = 'text/html';
    filePath = './err-page.html';
  }
  // if (!filePath.startsWith('public')) {
  //   contentType['Content-Type'] = 'text/html';
  //   filePath = './err-page.html';
  // }

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
