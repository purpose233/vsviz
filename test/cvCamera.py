import cv2 as cv
import numpy as np
import urllib
import socket
import json
import time

def send(s, data):
  info = {
    'type': 'image',
    'size': len(data)
  }
  s.send(json.dumps(info) + '|' + data)

if __name__ == '__main__':

  VIDEO_SERVER_PORT = 9000

  cv.namedWindow("camera", 1)
  capture = cv.VideoCapture(0) 
  capture.set(3, 640)
  capture.set(4, 480)

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(("127.0.0.1", VIDEO_SERVER_PORT))

  imgCount = 0
  while(True):
    ref,frame = capture.read()

    cv.imshow("camera", frame)

    img = cv.imencode('.jpg', frame)[1]
    # imgg = cv2.imencode('.png', img)
    dataEncoded = np.array(img)
    strEncoded = dataEncoded.tostring()
    
    send(s, strEncoded)

    imgCount += 1
    if imgCount == 10:
      break

    time.sleep(30.0 / 1000)
    # c = cv.waitKey(30) & 0xff 
    # if c == 27:
    #     break
  
  s.close()
  capture.release()
  cv.destroyWindow("camera")
