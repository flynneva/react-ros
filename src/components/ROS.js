import React, { useContext, useEffect } from 'react'
import ROSLIB from 'roslib'
import { ROSContext, ROSProvider } from './ROSContext'
import PropTypes from 'prop-types'

// ROS Hook that lets others use ROS websocket connection
// returns some useful functions & values
function useROS() {
  const [ros, setROS] = useContext(ROSContext);

  useEffect(() => {
    if (!ros.isConnected) {
      if(ros.autoconnect) {
        console.log('autoconnecting');
        handleConnect();
      }
    }
  })

  function toggleConnection() {
    if (ros.isConnected) {
      handleDisconnect();
    } else if (!ros.isConnected) {
      handleConnect();
    }
  }

  function toggleAutoconnect() {
    if (ros.autoconnect) {
      setROS(ros => ({ ...ros, autoconnect: false }));
    } else if (!ros.autoconnect) {
      setROS(ros => ({ ...ros, autoconnect: true }));
    }
  }
  
  function changeUrl(new_url) {
    setROS(ros => ({ ...ros, url: new_url }));
  }

  function getTopics() {
    const topicsPromise = new Promise((resolve, reject) => {
        ros.ROS.getTopics((topics) => {
          const topicList = topics.topics.map((topicName, i) => {
          return {
            path: topicName,
            msgType: topics.types[i],
            type: "topic",
          }
        });
        resolve({
          topics: topicList
        });
	reject({
          topics: []
	});
      }, (message) => {
        console.error("Failed to get topic", message)
      });
    });
    topicsPromise.then( (topics) => setROS(ros => ({ ...ros, topics: topics.topics })));
    return ros.topics;
  }

  function createListener(topic, msg_type, to_queue, compression_type) {
    var newListener = new ROSLIB.Topic({
      ros : ros.ROS,
      name : topic,
      messageType : msg_type,
      queue_length: to_queue,
      compression: compression_type,
    })

    for (var listener in ros.listeners) {
      if (newListener.name === ros.listeners[listener].name) {
        console.log('Listener already available in ros.listeners[' + listener + ']');
        return ros.listeners[listener];
      }
    }
    ros.listeners.push(newListener);
    console.log('Listener ' + newListener.name + ' created');
    return newListener;
  }
  
  const handleConnect = () => {
    try {
      ros.ROS = new ROSLIB.Ros({
        url : ros.url,
      });

      if (ros.ROS) ros.ROS.on('connection', () => {
        setROS(ros => ({ ...ros, isConnected: true }));
        getTopics();
      })

      if (ros.ROS) ros.ROS.on('error', (error) => {
        console.log(error);
      })
    } catch (e) {
      console.log(e);
    }
  }

  const handleDisconnect = () => {
    try {
      ros.ROS.close();
      setROS(ros => ({ ...ros, isConnected: false }));
      setROS(ros => ({ ...ros, topics: [] }));
      setROS(ros => ({ ...ros, listeners: [] }));
    } catch (e) {
      console.log(e);
    }
    console.log('Disconnect Requested');
  }
  
const removeAllListeners = () =>{
  for(var mlistener in ros.listeners){
    ros.listeners[mlistener].removeAllListeners();
  }
  setROS(ros => ({ ...ros, listeners: [] }));
}

function removeListener (listener){
  for(var mlistener in ros.listeners){
    if(listener.name === ros.listeners[mlistener].name){
      console.log('Listener: ' + listener.name + ' is removed')
      ros.listeners.splice(mlistener,1)
      listener.removeAllListeners();
      return
    }
  }
  console.log('Listener: ' + listener + ' is not a listener')
}

  return {
    toggleConnection,
    changeUrl,
    getTopics,
    createListener,
    toggleAutoconnect,
    removeAllListeners,
    removeListener,
    ros: ros.ROS,
    isConnected: ros.isConnected,
    autoconnect: ros.autoconnect,
    url: ros.url,
    topics: ros.topics,
    listeners: ros.listeners,
  }
}

// ROS Component to manage ROS websocket connection and provide
// it to children props
function ROS(props) {
  return (
    <ROSProvider>
      {props.children}
    </ROSProvider>
  );
}

ROS.propTypes = {
  children: PropTypes.node.isRequired,
}

export { useROS, ROS };
