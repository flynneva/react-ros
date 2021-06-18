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

  function checkConnection() {
    if (ros.ROS){
      if (ros.isConnected) {
        if (!ros.ROSConfirmedConnected && ros.ROS.isConnected) {
          setROS(ros => ({ ...ros, ROSConfirmedConnected: ros.ROS.isConnected }))
          console.log("Both react-ros and roslibjs have confirmed connection.")
        }
        // Once we have that "confirmation"  we need to continously check for good connection
        else if (ros.ROSConfirmedConnected && !ros.ROS.isConnected) {
          setROS(ros => ({ ...ros, isConnected: false }));
          handleDisconnect();
        }
        else if (!ros.ROS.isConnected) {
          console.log("React-ros has confirmed the connection, roslibjs has not yet.")
        }
      }
    }
    else{
      console.log("Initial connection not established yet")
    }
  }


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
        ros.topics = []
      });
    });
    topicsPromise.then((topics) => setROS(ros => ({ ...ros, topics: topics.topics })));
    return ros.topics;
  }

  function getServices() {
    const servicesPromise = new Promise((resolve, reject) => {
      ros.ROS.getServices((services) => {
        const serviceList = services.map((serviceName) => {
          return {
            path: serviceName,
            type: "service",
          }
        });
        resolve({
          services: serviceList
        });
        reject({
          services: []
        });
      }, (message) => {
        console.error("Failed to get services", message)
        ros.services = []
      });
    });
    servicesPromise.then((services) => setROS(ros => ({ ...ros, services: services.services })));
    return ros.services;
  }

  function createListener(topic, msg_type, to_queue, compression_type) {
    var newListener = new ROSLIB.Topic({
      ros: ros.ROS,
      name: topic,
      messageType: msg_type,
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
      ros.ROS.connect(ros.url)
      ros.ROS.on('connection', () => {
        // console.log(connect)
        setROS(ros => ({ ...ros, isConnected: true }));  // seems to take awhile for the roslibjs library to report connected
        setROS(ros => ({ ...ros, ROSConfirmedConnected: false }));
        getTopics();
        getServices();
      })

      ros.ROS.on('error', (error) => {  //gets a little annoying on the console, but probably ok for now
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
      setROS(ros => ({ ...ros, ROSConfirmedConnected: false }));
    } catch (e) {
      console.log(e);
    }
    console.log('Disconnected');
  }

  const removeAllListeners = () => {
    for (var mlistener in ros.listeners) {
      ros.listeners[mlistener].removeAllListeners();
    }
    setROS(ros => ({ ...ros, listeners: [] }));
  }

  function removeListener(listener) {
    for (var mlistener in ros.listeners) {
      if (listener.name === ros.listeners[mlistener].name) {
        console.log('Listener: ' + listener.name + ' is removed')
        ros.listeners.splice(mlistener, 1)
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
    getServices,
    createListener,
    toggleAutoconnect,
    removeAllListeners,
    removeListener,
    checkConnection,
    ros: ros.ROS,
    isConnected: ros.isConnected,
    autoconnect: ros.autoconnect,
    url: ros.url,
    topics: ros.topics,
    services: ros.services,
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
