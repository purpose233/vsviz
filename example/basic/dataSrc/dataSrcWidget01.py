import socket
import time
import sys

from common import send, SERVER

if __name__ == "__main__":

  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.connect(SERVER)

  info = {
    'id': 'widget0',
    'streamType': 'customed',
    'dataType': 'json',
    'sequence': 122,
    'timestamp': 0
  }
  data = '{\"test\": 123}'
  send(s, info, data)
