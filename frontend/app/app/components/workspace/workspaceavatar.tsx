import React from 'react'

const WorkspaceAvatar = ({color,name}:{color:string,name:string}) => {
  return (
    <div className=' w-5 h-5 rounded-full flex items-center justify-center' style={{backgroundColor:color}}>
      <span>{name.charAt(0).toUpperCase()}</span>
    </div>
  )
}

export default WorkspaceAvatar
