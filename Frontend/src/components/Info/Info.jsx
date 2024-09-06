import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import "./Info.css"
const Info = () => {
  return (
  <div className="info">
    <Sidebar/>
    <div className="info-content">
      <h1>Info Page</h1>
      <p>This is the info page. You can add any content or information here.</p>
  </div>
  </div>
  )
}

export default Info