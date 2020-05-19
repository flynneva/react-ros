import React, { useContext, useState } from 'react'
import ROSLIB from 'roslib'
import { ROSContext, ROSProvider } from './ROSContext'


// ROS Hook that lets others use ROS websocket connection
// returns some useful functions & values
function useROS(props) {
  const [ros, setROS] = useContext(ROSContext);

  function toggleConnection() {
    if (ros.isConnected) {
      handleDisconnect();
    } else if (!ros.isConnected) {
      handleConnect();
    }
  };

  function changeUrl(new_url) {
    setROS(ros => ({ ...state, url: new_url }));
  }

  function getTopics(): Promise<{topics: []}> {
    var topicsPromise = new Promise((resolve, reject) => {
      ros.ROS.getTopics((topics) => {
        const topicList = topics.topics.map((topicName, i) => {
          return {
            path: topicName,
            messageType: topics.types[i],
            type: "topic",
          }
        });
	resolve({
          topics: topicList
        });
      }, (message) => {
        console.error("Failed to get topic", message)
      });
    });
    topicsPromise.then( (topics) => setROS(ros => ({ ...ros, topics: topics.topics })));
    return ros.topics;
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
    ros: ros.ROS,
    isConnected: ros.isConnected,
    url: ros.url,
    topics: ros.topics,
  }
};

// ROS Component to manage ROS websocket connection and provide
// it to children props
function ROS(props: React.PropsWithChildren<props>) {
  const ros = useROS();
 
  return (
    <ROSProvider>
      {props.children}
    </ROSProvider>
  );
}

export { useROS, ROS };
