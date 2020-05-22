import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

const topicObj = {
  name: '/rosout',
  messageType: 'std_msgs/String',
  compression: 'cbor', 
  throttle_rate: 10, // in ms between messages
  queue_size: 100,
  latch: false,
  queue_length: 0,
  reconnect_on_close: true,
}

const TopicContext = createContext([{}, () => {}]);

export { TopicContext };
