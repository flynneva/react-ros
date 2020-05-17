import React, { createContext, useState, useEffect } from 'react'
import ROSLIB from 'roslib'

const rosObj = {
  url: "ws://localhost:9090",
  connected: false,
  ros: ROSLIB.Ros,
  toggleConnection: () => {}
}

const ROSContext = createContext(rosObj);

// ROS Hook that lets others use ROS websocket connection
// returns the ROSLIB.Ros object
function useROS(rosObj) {
  const [ connected, setConnected ] = useState(null);

  const handleConnect = () => {
    try {
      rosObj.ros = new ROSLIB.Ros({
        url : rosObj.url,
      });

      if (rosObj.ros) rosObj.ros.on('error', (error) => {
        setConnected(true);
      })

      if (rosObj.ros) rosObj.ros.on('error', (error) => {
        console.log(error)
      })
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    handleConnect();
  });

  return rosObj;
}

// ROS Component to 
function ROS(rosObj) {
  const ros = useROS(rosObj);
 
  var text = ""

  if (ros.connected) {
    console.log("HERE");
    text = "connected"
  } else {
    console.log("HERE");
    text ="not connected"
  }

  return (
    <div>
      ROS: {text}
    </div>
  )
}

export default ROS;
