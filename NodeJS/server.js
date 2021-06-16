// Creating server with Node.js that is accessible at localport 3000

// Import Node.Js modules
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// creating server and handling incoming request
const server = http.createServer((reqest, response) => {

    let filePath = path.join(__dirname, reqest.url === "/" ? "index.html" : reqest.url);

    let extName = path.extname(filePath);
    let contentType = 'text/html';

    // to handle multiple types of files
    switch (extName) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
    }

    // set response header
    response.writeHead(200, {'Content-Type': contentType});

    // open the file as a readable steam
    const readStream = fs.createReadStream(filePath);
    
    // this will wait until ther readable stream is actually valid before piping
    readStream.on ('open', function () {
        //pipe the read stream to the response object (goes to client)
        readStream.pipe(response);
    });
    // this catches any errors that happen while creating the readable stream
    readStream.on ('error', function(err) {
        response.end(err);
    });
  
});

//listen for nay incoming requests at port 3000
server.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`)
    } else {
        console.log(`Server listening at port ${port}...`);
    }
});