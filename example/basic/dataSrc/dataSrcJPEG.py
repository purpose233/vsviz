import socket
import time
import cv2 as cv
import numpy as np
import sys
import json

from common import send, SERVER

if __name__ == "__main__":

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(SERVER)

  if sys.argv[1] == 'meta':
    info = {
      'id': 'video0',
      'streamType': 'meta',
      'dataType': 'json',
      'sequence': 122,
      'timestamp': 0
    }
    dataOrigin = {
      'width': 1280,
      'height': 720
    }
    data = json.dumps(dataOrigin)
    send(s, info, data, 'string')
  else:
    cv.namedWindow('camera', 1)
    capture = cv.VideoCapture(0) 
    capture.set(3, 1280)
    capture.set(4, 720)

    info = {
      'id': 'video0',
      'streamType': 'video',
      'dataType': 'jpg',
      'sequence': 123,
      'timestamp': 1
    }

    while(True):
      ref, frame = capture.read()
      cv.imshow('camera', frame)

      # data = frame.flatten()
      img = cv.imencode('.jpg', frame)[1]
      data = np.array(img)
      send(s, info, data, 'array')

      info['sequence'] += 1
      info['timestamp'] += 1

      c = cv.waitKey(TIME_INTERVAL)
      if c != -1:
        break
      # time.sleep(TIME_INTERVAL)

    capture.release()
    s.close()
