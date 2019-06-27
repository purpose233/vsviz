import socket
import json
import cv2 as cv
import numpy as np
import rospy
from std_msgs.msg import String

from common import send
  
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(SERVER)

dataInfo = {
  'id': 'canvas0',
  'streamType': 'customed',
  'dataType': 'json',
  'sequence': 0,
  'timestamp': 1
}

def onData(msg):
  # get json data
  jsonData = {
    'observers': [],
    'marks': []
  }
  # for in :
  #   jsonData['observers'].append({
  #     'location': {
  #       'x': , 'y': , 'z'
  #     }
  #   })
  # for in :
  #   jsonData['marks'].append({
  #     'id': ,
  #     'code': ,
  #     'location': {
  #       'x': ,'y': , 'z'
  #     }
  #   })
  send(s, info, json.dumps(jsonData), 'string')

  info['sequence'] += 1
  info['timestamp'] += 1

if __name__ == "__main__":

  rospy.init_node('vizMarkSender', anonymous=True)
  rospy.Subscriber('/mark', Image, onData)
  rospy.spin()

  s.close()
