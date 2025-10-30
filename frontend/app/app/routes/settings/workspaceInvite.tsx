import React from 'react'
import { useParams, useSearchParams } from 'react-router';

const WorkspaceInvite = () => {
const [searchparams] = useSearchParams();
// const workspaceid=searchparams.get("workspaceid");
console.log(searchparams)
  return (
    <div>
      <h1>Workspace Invite</h1>
        {/* <p>Workspace ID: {workspaceid}</p> */}
    </div>
  )
}

export default WorkspaceInvite
