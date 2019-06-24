import socket
import time
import cv2 as cv
import numpy as np
import sys
import json

SERVER = ("127.0.0.1", 9000)
TIME_INTERVAL = 30
HEADER_SIZE = 32

def copyByte(src, target, targetOffset, srcStart, srcEnd):
  i = srcStart
  j = targetOffset
  maxLen = min(len(target) - targetOffset, srcEnd - srcStart, len(src) - srcStart)
  while i < srcStart + maxLen:
    target[j] = src[i]
    j += 1
    i += 1

def wrapData(info, data, dataType):
  size = HEADER_SIZE + len(data)
  b = bytearray(size)
  copyByte(bytearray(info['id'], 'utf-8'), b, 0, 0, 8)
  copyByte(bytearray(info['streamType'], 'utf-8'), b, 8, 0, 8)
  copyByte(bytearray(info['dataType'], 'utf-8'), b, 16, 0, 8)
  copyByte(len(data).to_bytes(4, byteorder='big'), b, 24, 0, 8)
  copyByte(info['timestamp'].to_bytes(4, byteorder='big'), b, 28, 0, 8)
  if dataType == 'string':
    copyByte(bytearray(data, 'utf-8'), b, 32, 0, len(data))
  else:
    copyByte(bytearray(data), b, 32, 0, len(data))
  return b

def send(s, info, data, dataType):
  s.send(wrapData(info, data, dataType))

if __name__ == "__main__":

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(SERVER)

  if sys.argv[1] == 'meta':
    info = {
      'id': 'video0',
      'streamType': 'meta',
      'dataType': 'json',
      'timestamp': 122
    }
    dataOrigin = {
      'width': 640,
      'height': 480
    }
    data = json.dumps(dataOrigin)
    send(s, info, data, 'string')
  else:
    # cv.namedWindow('camera', 1)
    capture = cv.VideoCapture(0) 
    capture.set(3, 640)
    capture.set(4, 480)

    info = {
      'id': 'video0',
      'streamType': 'video',
      'dataType': 'jpg',
      'timestamp': 123
    }

    while(True):
      ref, frame = capture.read()
      # cv.imshow('camera', frame)

      # data = frame.flatten()
      img = cv.imencode('.jpg', frame)[1]
      data = np.array(img)
      send(s, info, data, 'array')

      info['timestamp'] += 1

      c = cv.waitKey(TIME_INTERVAL)
      if c != -1:
        break
      # time.sleep(TIME_INTERVAL)

    capture.release()
    s.close()
