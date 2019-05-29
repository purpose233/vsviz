const net = require('net');
const fs = require('fs');

const VIDEO_SERVER_PORT = 9000;

const videoServer = net.createServer((socket) => {
  // TODO: only one client will be received at one time
  socket.on('error', (e) => {console.log(e);});

  let isPacking = false;
  socket.on('data', (data) => {

    console.log(data);
    fs.appendFile('img.jpg', data, (err) => {
      if (err) throw err;
      console.log('图片已被保存于 img.jpg');
    });
  });
});

videoServer.listen(VIDEO_SERVER_PORT, '127.0.0.1');
console.log('Video server is listening on port: ', VIDEO_SERVER_PORT);
