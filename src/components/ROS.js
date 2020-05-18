import React, { useContext, useState, useEffect } from 'react'
import ROSLIB from 'roslib'
import { ROSContext } from './ROSContext'

// ROS Hook that lets others use ROS websocket connection
// returns the ROSLIB.Ros object
function useROS(props) {
  const rosEnv = useContext(ROSContext);

  const handleConnect = () => {
    try {
      rosEnv.ros = new ROSLIB.Ros({
        url : rosEnv.url,
      });

      if (rosEnv.ros) rosEnv.ros.on('error', (error) => {
        
      })

      if (rosEnv.ros) rosEnv.ros.on('error', (error) => {
        console.log(error);
      })
    } catch (e) {
      console.log(e);
    }
  }

  const handleDisconnect = () => {
    try {
      rosEnv.ros.close();
      rosEnv.connected = false;
      rosEnv.error = null;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (rosEnv.connected) {
      handleDisconnect();
    } else if (!rosEnv.connected) {
      handleConnect();
    }
  });

  return (
    <ROSContext.Consumer>
      <h1>{rosEnv.connected}</h1>
      <p>{rosEnv.url}</p>
    </ROSContext.Consumer>
  );
}

// ROS Component to manage ROS websocket connection and provide
// it to children props
function ROS(props: React.PropsWithChildren<props>) {
  const ros = useROS();
 
  var text = ""

  useEffect(() => {
    if (ros.connected) {
      console.log("connected");
      text = "connected";
    } else {
      console.log("not connected");
      text ="not connected";
    }
  });

  return (
    <ROSContext.Provider>
      {props.children}
    </ROSContext.Provider>
  );
}

export default ROS;
