import { useQuery } from '@tanstack/react-query'
import React from 'react'

const Activity = ({resourceid}:{resourceid:string}) => {
    const {data,isPending}=useQuery({
        queryKey:['task-activity',resourceid],
        // queryFn
    })
  return (
    <div>
      Activity
    </div>
  )
}

export default Activity
