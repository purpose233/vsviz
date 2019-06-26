import socket
import json

from common import send, SERVER

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(SERVER)

dataInfo = {
  'id': 'canvas0',
  'streamType': 'customed',
  'dataType': 'json',
  'sequence': 1,
  'timestamp': 1
}

if __name__ == "__main__":

	msg = {
		'observer': {
			'location': { 'x': 1, 'y': -2, 'z': 1}
		},
		'marks': [
			{
				'id': 'mark1',
				'location': {'x': 0, 'y': 0, 'z': 1},
				'code': '0101001'
			}
		]
	}
	send(s, dataInfo, json.dumps(msg), 'string')

	s.close()
