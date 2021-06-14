import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import ROSLIB from 'roslib'

const rosObj = {
  ROS: new ROSLIB.Ros(),
  url: "ws://localhost:9090",
  isConnected: false,
  ROSConfirmedConnected: false,
  autoconnect: false,
  topics: [],
  services:[],
  listeners: [],
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

ROSProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { ROSContext, ROSProvider };
