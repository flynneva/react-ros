import React, { useEffect } from 'react'
import { useROS } from '../ROS'

function ToggleConnect() {
  const { isConnected, topics, url, changeUrl, toggleConnection, toggleAutoconnect} = useROS();

  // Try replacing this with your own unique rosbridge webserver address
  const defaultURL = "ws://0.0.0.0:9090";
	
  // only runs once when ToggleConnect is first rendered (mounted)
  useEffect(() => {
    console.log('ToggleConnect is mounted!');
    if (url !== defaultURL) {
      changeUrl(defaultURL);
    }

    if (!isConnected) {
      toggleAutoconnect();
    }
  },[])
    
  // runs every time there is an update to any state/rerender
  useEffect(() => {
    //console.log('rerender ToggleConnect');
  })

  return (
    <div>
      <p>
        <b>Simple connect:  </b><button onClick={ toggleConnection }>Toggle Connect</button>  <br />
        <b>ROS url input:  </b><input name="urlInput" defaultValue={ url } onChange={event => changeUrl(event.target.value)} />  <br />
        <b>ROS url to connect to:  </b> {url}  <br />
        <b>Status of ROS:</b> { isConnected ? "connected" : "not connected" }   <br />
        <b>Topics detected:</b><br />
        { topics.map((topic, i) => <li key={i}>    {topic.path}</li> )}
      </p>
    </div>
  );
}

export default ToggleConnect;
