import socket
import time
import sys

SERVER = ("127.0.0.1", 9000)
TIME_INTERVAL = 1000 / 1000
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

def wrapData(info, data):
  size = len(PACKAGE_INIT_CODE) + HEADER_SIZE + len(data)
  b = bytearray(size)
  copyByte(bytearray(PACKAGE_INIT_CODE, 'utf-8'), b, 0, 0, 4)
  copyByte(bytearray(info['id'], 'utf-8'), b, 4, 0, 8)
  copyByte(bytearray(info['streamType'], 'utf-8'), b, 12, 0, 8)
  copyByte(bytearray(info['dataType'], 'utf-8'), b, 20, 0, 8)
  copyByte(to_bytes(len(data), 4), b, 28, 0, 8)
  copyByte(to_bytes(info['sequence'], 4), b, 32, 0, 8)
  copyByte(to_bytes(info['timestamp'], 4), b, 36, 0, 8)
  copyByte(bytearray(data, 'utf-8'), b, 40, 0, len(data))
  return b

def send(s, info, data):
  s.send(wrapData(info, data))

if __name__ == "__main__":

  scriptType = sys.argv[1]
  if scriptType == 'meta':
    isMeta = True
  else:
    isMeta = False

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(SERVER)

  if isMeta:
    info = {
      'id': 'canvas0',
      'streamType': 'meta',
      'dataType': 'json',
      'sequence': 122,
      'timestamp': 0
    }
    data = '{\"width\": 800}'
    send(s, info, data)
  else:
    info = {
      'id': 'canvas0',
      'streamType': 'customed',
      'dataType': 'string',
      'sequence': 123,
      'timestamp': 1
    }
    data = '{\"test\": 123}'

    while(True):
      time.sleep(TIME_INTERVAL)
      info['sequence'] += 1
      info['timestamp'] += 1
      send(s, info, data)
