import React from 'react'

import { ROS, Echo } from 'react-ros'

const App = () => {
  return (
    <ROS>
      <p>Hello world!</p>
      <Echo />
    </ROS>
  )
}

export default App
