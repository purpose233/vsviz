const videoshow = require('videoshow');
const path = require('path');

const imagePaths = [];
for (let i = 0; i < 10; i++) {
  imagePaths.push(path.resolve('./img' + i + '.jpg'));
}

const videoPath = path.resolve('./video.mp4');

const videoOptions = {
  fps: 30,
  loop: 0.03,
  // loop: 5, // seconds
  transition: false,
  // transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  // audioBitrate: '128k',
  // audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

videoshow(imagePaths, videoOptions)
  .save(videoPath)
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err) {
    console.error('Error:', err)
  })
  .on('end', function (output) {
    console.log('Video created in:', output)
  })
