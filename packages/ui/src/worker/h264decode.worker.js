const Decoder = require('../../third-party/Decoder.js');
// TODO: judge whether Decode is null

if (self !== undefined) {
  let decoder = new Decoder({ rgb: true });
  // console.log(decoder);
  decoder.onPictureDecoded = async (data, width, height) => {
    console.log(data);
    try {
      const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
      const bitmap = await self.createImageBitmap(imageData, 0, 0, width, height);
      self.postMessage(bitmap);
    } catch(e) {
      console.log(e);
    }
  }

  self.onmessage = async (e) => {
    decoder.decode(e.data);
  }
}
