const fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});
wss.on('connection', (ws) => {
  const imgData = fs.readFileSync('./test.png');
  ws.send(imgData);
  for (let i = 0; i < 10; i++) {
    ws.send('hello!');
  }
  ws.close();
  wss.close();
});

const ws = new WebSocket('ws://localhost:8080');
ws.on('open', () => {
  console.log('ws is opened');
});
let msgCount = 0;
ws.on('message', (msg) => {
  console.log('receive package No.', msgCount++);
});
ws.on('close', (code) => {
  console.log('ws is closed, code: ', code);
});
