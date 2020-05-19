import React from 'react'
import { useROS } from '../ROS'

function ToggleConnect() {
  const { isConnected, topics, toggleConnection } = useROS();

  return (
    <div>
      <button onClick={ toggleConnection }>Toggle Connect</button>
      <div>Status of ROS: { isConnected ? "connected" : "not connected" }</div>
      <div>Topics detected:</div>
      { topics.map((topic, i) => <li key={i}>    {topic.path}</li> )}
    </div>
  );
}

export default ToggleConnect;
