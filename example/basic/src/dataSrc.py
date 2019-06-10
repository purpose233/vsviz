import socket
import time

SERVER = ("127.0.0.1", 9000)
TIME_INTERVAL = 100 / 1000
HEADER_SIZE = 32

def copyByte(src, target, targetOffset, srcStart, srcEnd):
  i = srcStart
  j = targetOffset
  maxLen = min(len(target) - targetOffset, srcEnd - srcStart, len(src) - srcStart)
  while i < srcStart + maxLen:
    target[j] = src[i]
    j += 1
    i += 1

def send(s, info, data):
  size = HEADER_SIZE + len(data)
  b = bytes(size)
  copyByte(bytearray(info['id'], 'utf-8'), b, 0, 0, 8)
  copyByte(bytearray(info['streamType'], 'utf-8'), b, 8, 0, 8)
  copyByte(bytearray(info['dataType'], 'utf-8'), b, 16, 0, 8)
  copyByte(len(data).to_bytes(4, byteorder='big'), b, 24, 0, 8)
  copyByte(info['timestamp'].to_bytes(4, byteorder='big'), b, 28, 0, 8)
  copyByte(bytearray(data, 'utf-8'), b, 32, 0, len(data))
  print(b)
  s.send(b)

if __name__ == "__main__":

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(SERVER)
  info['id'] = 'aaa'
  info['streamType'] = 'customed'
  info['dataType'] = 'string'
  info['timestamp'] = 123
  data = '{test: true}'

  while(True):
    time.sleep(TIME_INTERVAL)
    info['timestamp'] += 1
    send(s, info, data)    