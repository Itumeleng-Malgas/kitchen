import React from 'react'

const DashboardFooter = () => {
  return (
    <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
      <span style={{ fontWeight: 'bolder' }}>nQue Technologies</span> © {new Date().getFullYear()}
    </div>
  )
}

export default DashboardFooter