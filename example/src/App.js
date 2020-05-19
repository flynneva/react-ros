import React from 'react'

import { ROS, Echo } from 'react-ros'

const App = () => {
  return (
    <ROS>
      <h2>Welcome</h2>
      <Echo />
    </ROS>
  )
}

export default App
