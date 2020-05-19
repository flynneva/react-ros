import React, { createContext, useState } from 'react'
import ROSLIB from 'roslib'

const rosObj = {
  ROS: null,
  url: "ws://localhost:9090",
  isConnected: false,
}

const ROSContext = createContext([{}, () => {}]);

const ROSProvider = (props) => {
  const [ ros, setROS ] = useState(rosObj);
  return (
    <ROSContext.Provider value={[ros, setROS]}>
      {props.children}
    </ROSContext.Provider>
  );
}

export { ROSContext, ROSProvider };
