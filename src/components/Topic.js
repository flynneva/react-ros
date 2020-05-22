import React, { useContext, useEffect } from 'react'
import ROSLIB from 'roslib'
import { useROS } from './ROS'
import { TopicContext } from './TopicContext'
import PropTypes from 'prop-types'

function useTopic(props) {
  const ros = useROS();
  const [topic, setTopic] = useContext(TopicContext);

  useEffect(() => {
    if (props.name) {
      setTopic(topic => ({ ...topic, name: props.name}));
    } else if {
      console.log("no topic name provided. please provide a topic name");
    }
  }

  return {
    topic: topic.Topic,
    name: topic.name,
  }
}

export { useTopic };
