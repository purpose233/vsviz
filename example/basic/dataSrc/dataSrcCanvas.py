import socket
import time
import sys

from common import send, SERVER

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
      time.sleep(1)
      info['sequence'] += 1
      info['timestamp'] += 1
      send(s, info, data)
