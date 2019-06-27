import socket
import json
import cv2 as cv
import numpy as np
import rospy
from vslam.msg import Viz

from common import send, SERVER
  
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
  for data in msg.cameras:
    jsonData['observers'].append({
      'location': {
        'x': data.camera_pose.position.x, 
        'y': data.camera_pose.position.y, 
        'z': data.camera_pose.position.z
      }
    })
  for data in msg.cards:
    jsonData['marks'].append({
      'id': data.card_id,
      'code': data.code_id,
      'location': {
        'x': data.card_pose.position.x,
        'y': data.card_pose.position.y, 
        'z': data.card_pose.position.z
      }
    })
  send(s, dataInfo, json.dumps(jsonData), 'string')

  dataInfo['sequence'] += 1
  dataInfo['timestamp'] += 1

if __name__ == "__main__":

  rospy.init_node('vizMarkSender', anonymous=True)
  rospy.Subscriber('slam_viz', Viz, onData)
  rospy.spin()

  s.close()
