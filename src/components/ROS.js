import React, { useContext } from 'react'
import ROSLIB from 'roslib'
import { ROSContext, ROSProvider } from './ROSContext'
import PropTypes from 'prop-types'

// ROS Hook that lets others use ROS websocket connection
// returns some useful functions & values
function useROS() {
  const [ros, setROS] = useContext(ROSContext);

  function toggleConnection() {
    if (ros.isConnected) {
      handleDisconnect();
    } else if (!ros.isConnected) {
      handleConnect();
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
    console.log('Listener created');
    return newListener;
  }
  
  const handleConnect = () => {
    try {
      ros.ROS = new ROSLIB.Ros({
        url : ros.url,
      });

      if (ros.ROS) ros.ROS.on('connection', (error) => {
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
    } catch (e) {
      console.log(e);
    }
  }
  return {
    toggleConnection,
    changeUrl,
    getTopics,
    createListener,
    ros: ros.ROS,
    isConnected: ros.isConnected,
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
