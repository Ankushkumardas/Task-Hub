import React from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { postdata } from '~/lib/fetchutil';
import { Button } from '~/components/ui/button';
import { useAcceptInviteMutation, useGetWorkspaceQuery } from '~/hooks/useWorkspace';
import { Card, CardContent, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { toast } from 'sonner';

const WorkspaceInvite = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  // token might be provided as ?token=... and workspace id as route param
  const tokenQuery = searchParams.get('token');
  const workspaceid = params.workspaceid || searchParams.get('workspaceid');

    const token = tokenQuery;

  const {data:workspace,isLoading}=useGetWorkspaceQuery(workspaceid as string);

  const {mutate:acceptInviteToken,isPending}=useAcceptInviteMutation();

  if(!workspaceid){
    return <div className="p-6">
      <h1 className="text-2xl font-semibold">Invalid Invite Link</h1>
      <p className="mt-2">Missing workspace ID.</p>
    </div>
  }
  if(isLoading) {
    return <div className="p-6">
      <h1 className="text-2xl font-semibold">Loading...</h1>
    </div>
  } 
if(!workspace) {
    return <div className="p-6">
      <h1 className="text-2xl font-semibold">Workspace Not Found</h1>
      <p className="mt-2">The workspace you are trying to join does not exist.</p>
    </div>
}
  console.log(workspace.workspace)

const handleAcceptInvite = () => {
  if(!workspaceid) return;
  if(!token){
    toast.error("Missing invite token");
    return;
  }
  acceptInviteToken(
    { token: token as string },
    {
      onSuccess: () => {
        navigate(`/workspaces/${workspaceid}`);
        toast.success("Successfully joined the workspace");
      },
      onError: () => {
        toast.error("Failed to join the workspace");
      }
    }
  );
};

const handleDeclineInvite = () => {
  navigate('/workspaces');
};

  return (
    <div className="p-6 flex justify-center items-center">
      <div className="max-w-md w-full">
      <div className="mb-6 text-center mt-20">
        <h1 className="text-2xl font-semibold">Workspace Invite</h1>
        <p className="mt-2 text-muted-foreground">You are invited to join this workspace.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
        <span
          className="inline-block w-4 h-4 rounded-full"
          style={{ background: workspace.workspace.color }}
          title={workspace.workspace.color}
        />
        <CardTitle className="text-lg font-bold">{workspace.workspace.name}</CardTitle>
        <span className="ml-auto">
        </span>
          </div>
          <p className="mb-2 text-muted-foreground">{workspace.workspace.description}</p>
          <div className="mb-2 flex gap-2">
        <Badge variant="outline">Created: {new Date(workspace.workspace.createdAt).toLocaleDateString()}</Badge>
        <Badge variant="outline">Updated: {new Date(workspace.workspace.updatedAt).toLocaleDateString()}</Badge>
          </div>
          <div className="mb-2">
        <Badge variant="default">Projects: {workspace.workspace.projects?.length || 0}</Badge>
          </div>
          <div className="mb-4">
        <Badge variant={tokenQuery ? "outline" : "destructive"}>
          Token: {tokenQuery ? 'present' : 'missing'}
        </Badge>
          </div>
          <div>
        <h3 className="font-semibold mb-2">Members</h3>
        <div className="space-y-2">
          {workspace.workspace.members?.map((m: any) => (
            <div key={m._id} className="flex items-center gap-2">
          <Badge variant="secondary">{m.role}</Badge>
          <span>{m.user.name}</span>
          <span className="text-xs text-muted-foreground">({m.user.email})</span>
          <span className="ml-auto text-xs text-muted-foreground">
            Joined: {new Date(m.joinedAt).toLocaleDateString()}
          </span>
            </div>
          ))}
        </div>
          </div>
          <div className="mt-6">
        {/* <Button onClick={accept}>Accept Invite</Button> */}
          </div>
        </CardContent>
      </Card>

      <div>
        <Button onClick={handleAcceptInvite} className="mr-2">
          Accept Invite
        </Button>
          <Button onClick={handleDeclineInvite}>
          Decline Invite
        </Button>
        
      </div>
      </div>
    </div>
  )
}

export default WorkspaceInvite
