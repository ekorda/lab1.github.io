const http = require("http");
const fs = require("fs");
//const path = require('path');
const server = http.createServer();
server.on('request', function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const src = fs.createReadStream("./picture.jpg");
        src.pipe(res);
});
server.listen(8000);

//----------------------------

