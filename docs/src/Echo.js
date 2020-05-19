import React, { useContext } from 'react'
import { useROS } from './ROS'

function Echo(props) {
  const { isConnected, topics, toggleConnection } = useROS();
  
  return (
    <div>
      <div>Status of ROS: { isConnected ? "connected" : "not connected" }</div>
      <button onClick={ toggleConnection }>Toggle Connect</button>
      { topics.map((topic, i) => <li key={i}>{topic.path}</li> )}
    </div>
  );
}

export default Echo;
