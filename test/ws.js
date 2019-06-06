const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    console.log(msg);
  });
});

const ws = new WebSocket('ws://localhost:8080');
ws.on('open', () => {
  // const arr = new Uint8Array([1,2,3]);
  // ws.send(arr);

  const arr = new Float32Array(5);
  for (let i = 0 ; i < 5; i++) {
    arr[i] = i / 2;
  }
  ws.send(arr);
});
