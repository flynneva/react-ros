import React, { useState, useEffect } from 'react'
import { useROS } from '../ROS'

var listener = null;

function EchoTopic() {
  const { createListener, topics, isConnected } = useROS();
  const [ lastMsg, setLastMsg ] = useState('');
  const [ topic, setTopic ] = useState('/');
  const [ queue, setQueue ] = useState(0);
  const [ compression, setCompression ] = useState('none');

  useEffect(() => {
    handleTopic(topic);
  });

  const unsubscribe = () => {
    if (listener) {
      console.log("Unsubscribing");
      listener.unsubscribe();
    }
  }

  const handleTopic = (topicInput) => {
    if (topic !== topicInput) {
      setTopic(topicInput);
      unsubscribe();
      return;
    }

    unsubscribe();
    listener = null;

    for (var i = 0; i < topics.length; i++) {
      if (topics[i].path == topicInput) {
        var newListener = null;
        listener = createListener( topics[i].path,
                                   topics[i].msgType,
                                   Number(queue),
                                   compression);
        console.log("Listener created");
        console.log(listener);
        break;
      }
    }

    if (listener) {
      console.log("Subscribing to messages...");
      listener.subscribe(handleMsg);
    } else {
      console.log("Topic '" + topic + "' not found...make sure to input the full topic path - including the leading '/'");
    }
  }

  const handleQueue = (queueInput) => {
    setQueue(queueInput);
    handleTopic(topic);
  }

  const handleCompression = (compInput) => {
    setCompression(compInput);
    handleTopic(topic);
  }

  const handleMsg = (msg) => {
    console.log(msg);
  }

  return (
    <div>
      <b>Message Queue Length:  </b><input name="queueInput" defaultValue={ queue } onChange={event => handleQueue(event.target.value)} />  <br />
      <b>Compression:  </b><input name="compInput" defaultValue={ compression } onChange={event => handleCompression(event.target.value)} />  <br />
      <b>Topic to echo:  </b><input name="topicInput" defaultValue={ topic } onChange={event => handleTopic(event.target.value)} />  <br />
    </div>
  );
}

export default EchoTopic;
