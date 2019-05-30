const net = require('net');
const fs = require('fs');
const Parser = require('./common/parser');
const {writeFile} = require('./common/file');

const VIDEO_SERVER_PORT = 9000;

let imgCount = 0;

const videoServer = net.createServer((socket) => {
  const parser = new Parser();

  // TODO: only one client will be received at one time
  socket.on('error', (e) => {console.log(e);});

  socket.on('data', async (data) => {
    console.log('Receive package.');

    const info = parser.parse(data);
    if (info) {
      switch (info.type) {
        case 'image': 
          const fileName = 'img' + (imgCount++) +'.jpg';
          if (imgCount == 10) {
            imgCount = 0;
          }
          await writeFile(fileName, info.data); 
          console.log('Image has been writen to: ', fileName);
          break;
      }
    }
  });
});

videoServer.listen(VIDEO_SERVER_PORT, '127.0.0.1');
console.log('Video server is listening on port: ', VIDEO_SERVER_PORT);
