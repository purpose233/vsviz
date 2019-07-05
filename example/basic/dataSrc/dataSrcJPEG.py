import socket
import time
import cv2 as cv
import numpy as np
import sys
import json

SERVER = ("127.0.0.1", 9000)
TIME_INTERVAL = 30
HEADER_SIZE = 36
PACKAGE_INIT_CODE = 'ADAM'

def copyByte(src, target, targetOffset, srcStart, srcEnd):
  i = srcStart
  j = targetOffset
  maxLen = min(len(target) - targetOffset, srcEnd - srcStart, len(src) - srcStart)
  while i < srcStart + maxLen:
    target[j] = src[i]
    j += 1
    i += 1

def wrapData(info, data, dataType):
  size = len(PACKAGE_INIT_CODE) + HEADER_SIZE + len(data)
  b = bytearray(size)
  copyByte(bytearray(PACKAGE_INIT_CODE, 'utf-8'), b, 0, 0, 4)
  copyByte(bytearray(info['id'], 'utf-8'), b, 4, 0, 8)
  copyByte(bytearray(info['streamType'], 'utf-8'), b, 12, 0, 8)
  copyByte(bytearray(info['dataType'], 'utf-8'), b, 20, 0, 8)
  copyByte(len(data).to_bytes(4, byteorder='big'), b, 28, 0, 8)
  copyByte(info['sequence'].to_bytes(4, byteorder='big'), b, 32, 0, 8)
  copyByte(info['timestamp'].to_bytes(4, byteorder='big'), b, 36, 0, 8)
  if dataType == 'string':
    copyByte(bytearray(data, 'utf-8'), b, 40, 0, len(data))
  else:
    copyByte(bytearray(data), b, 40, 0, len(data))
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