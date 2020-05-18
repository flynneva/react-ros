import React from 'react'

import { ROS } from 'react-ros'
import { ROSContext } from 'react-ros'

const App = () => {
  return (
    <ROS url="ws://localhost:9090">
      <p>Hello world!</p>
    </ROS>
  )
}

export default App
