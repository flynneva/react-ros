import React from 'react'
import { useROS } from '../ROS'

function ToggleConnect() {
  const { isConnected, topics, url, toggleConnection } = useROS();

  return (
    <div>
      <p><strong>ROS url:</strong> {url}</p>
      <button onClick={ toggleConnection }>Toggle Connect</button>
      <p><strong>Status of ROS:</strong> { isConnected ? "connected" : "not connected" }</p>
      <p><strong>Topics detected:</strong></p>
      { topics.map((topic, i) => <li key={i}>    {topic.path}</li> )}
    </div>
  );
}

export default ToggleConnect;
