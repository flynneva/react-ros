import React, { useContext } from 'react'
import { useROS } from './ROS'

function Echo(props) {
  const { isConnected, toggleConnection } = useROS();
  
  return (
    <div>
      <div>Status of ROS: { isConnected ? "connected" : "not connected" }</div>
      <button onClick={ toggleConnection }>Toggle Connect</button>
    </div>
  );
}

export default Echo;
