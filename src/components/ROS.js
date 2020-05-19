import React, { useContext, useState, useEffect } from 'react'
import ROSLIB from 'roslib'
import { ROSContext, ROSProvider } from './ROSContext'

// ROS Hook that lets others use ROS websocket connection
// returns the ROSLIB.Ros object
function useROS(props) {
  const [ros, setROS] = useContext(ROSContext);

  const handleConnect = () => {
    try {
      console.log("connecting...");
      ros.ROS = new ROSLIB.Ros({
        url : ros.url,
      });

      if (ros.ROS) ros.ROS.on('connection', (error) => {
        console.log("connected!");
        setROS(ros => ({ ...ros, isConnected: true }));
      })

      if (ros.ROS) ros.ROS.on('error', (error) => {
        console.log(error);
      })
    } catch (e) {
      console.log(e);
    }
  }

  const handleDisconnect = () => {
    console.log("disconnecting...");
    try {
      ros.ROS.close();
      setROS(ros => ({ ...ros, isConnected: false }));
    } catch (e) {
      console.log(e);
    }
  }

  function toggleConnection() {
    console.log("in toggle connect");
    if (ros.isConnected) {
      handleDisconnect();
    } else if (!ros.isConnected) {
      handleConnect();
    }
  };

  function changeUrl(new_url) {
    setROS(ros => ({ ...state, url: new_url }));
  }

  return {
    toggleConnection,
    changeUrl,
    ros: ros.ROS,
    isConnected: ros.isConnected,
    url: ros.url,
  }
};

// ROS Component to manage ROS websocket connection and provide
// it to children props
function ROS(props: React.PropsWithChildren<props>) {
  const ros = useROS();
 
  useEffect(() => {
    if (ros.connected) {
      console.log("connected");
      console.log("do nothing");
    } else {
      console.log("not connected");
      console.log("try to connect...");
      ros.toggleConnection();
    }
  });

  return (
    <ROSProvider>
      {props.children}
    </ROSProvider>
  );
}

export { useROS, ROS };
