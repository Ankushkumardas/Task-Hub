import { formatDistanceToNowStrict } from 'date-fns';
import React from 'react'
import { useSearchParams, useParams } from 'react-router-dom';
import { Badge } from '~/components/ui/badge';
import { useGetWorkspaceMembersQuery } from '~/hooks/useWorkspace.js'

const Members: React.FC = () => {
  const params = useParams();
  const [searchparams]=useSearchParams()
  const workspaceid = (params.workspaceid as string) || (searchparams.get("workspaceid") as string);

const {data: members = [], isLoading, isError} = useGetWorkspaceMembersQuery(workspaceid);
console.log('members hook', members)
 if(isLoading){
    return <div>Loading members...</div>
  }
    if(isError){
    return <div>Error loading members.</div>
    }
  return (
    <div>
      {members.length === 0 ? (
        <div>No members found in this workspace.</div>
      ) : (
        members.map((member: any) => (
          <div key={member.user._id} className="p-2 border max-w-[200px] rounded-md">
            <h3 className=" font-medium">{member.user.name}</h3>
            <p className="text-sm text-gray-500">{member.user.email}</p>
            <p className="text-sm text-gray-400">Role:
                {member.role === "owner" && <Badge variant="destructive">Owner</Badge>}
                {member.role === "admin" && <Badge variant="outline">Admin</Badge>}
                {member.role === "member" && <Badge variant="secondary">Member</Badge>}
                {member.role === "viewer" && <Badge>Viewer</Badge>}
            </p>
            <p className="text-sm text-gray-400">Joined: {formatDistanceToNowStrict(member.joinedAt)} ago</p>
            
          </div>
        ))
      )}
    </div>
  )
}

export default Members;
