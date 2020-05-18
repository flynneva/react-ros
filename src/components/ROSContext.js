import React, { createContext } from 'react'
import ROSLIB from 'roslib'

var rosObj = {
  url: "ws://localhost:9090",
  connected: false,
  ros: ROSLIB.Ros,
  toggleConnection: () => {}
}

export const ROSContext = createContext(rosObj);
