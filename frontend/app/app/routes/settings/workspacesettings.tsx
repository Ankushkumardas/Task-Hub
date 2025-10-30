import React from 'react'
import { useParams } from 'react-router';

const Workspacesettings = () => {
    const { workspaceid } = useParams();
  return (  
    <div>
        Workspacesettings {workspaceid}
    </div>
  )
}

export default Workspacesettings
