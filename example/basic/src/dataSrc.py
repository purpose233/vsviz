import socket
import time

SERVER = ("127.0.0.1", 9000)
TIME_INTERVAL = 1000 / 1000
HEADER_SIZE = 32

def copyByte(src, target, targetOffset, srcStart, srcEnd):
  i = srcStart
  j = targetOffset
  maxLen = min(len(target) - targetOffset, srcEnd - srcStart, len(src) - srcStart)
  while i < srcStart + maxLen:
    target[j] = src[i]
    j += 1
    i += 1

def wrapData(info, data):
  size = HEADER_SIZE + len(data)
  b = bytearray(size)
  copyByte(bytearray(info['id'], 'utf-8'), b, 0, 0, 8)
  copyByte(bytearray(info['streamType'], 'utf-8'), b, 8, 0, 8)
  copyByte(bytearray(info['dataType'], 'utf-8'), b, 16, 0, 8)
  copyByte(len(data).to_bytes(4, byteorder='big'), b, 24, 0, 8)
  copyByte(info['timestamp'].to_bytes(4, byteorder='big'), b, 28, 0, 8)
  copyByte(bytearray(data, 'utf-8'), b, 32, 0, len(data))
  return b

def send(s, info, data):
  s.send(wrapData(info, data))

if __name__ == "__main__":

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(SERVER)

  metaInfo = {
    'id': 'aaa',
    'streamType': 'meta',
    'dataType': 'json',
    'timestamp': 122
  }
  metaData = '{\"metaData\": 666}'
  send(s, metaInfo, metaData)
  time.sleep(TIME_INTERVAL)

  info = {
    'id': 'aaa',
    'streamType': 'customed',
    'dataType': 'string',
    'timestamp': 123
  }
  data = '{\"test\": 123}'

  while(True):
    time.sleep(TIME_INTERVAL)
    info['timestamp'] += 1
    send(s, info, data)

