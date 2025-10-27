import React from 'react'

const TaskStatus = ({status,taskid}:{taskid:string,status:string}) => {
  return (
    <div>
     Status: {status} 
    </div>
  )
}

export default TaskStatus
