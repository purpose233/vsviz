const ws = new WebSocket('ws://localhost:3000/');

ws.onopen = function () {
  console.log('ws is opened');
};
ws.onclose = function () {
  console.log('ws is closed');
}
ws.onmessage = function (msg) {
  console.log('ws receive message: ', msg);
};
