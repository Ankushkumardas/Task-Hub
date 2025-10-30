import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const MembersRedirect = () => {
	const params = useParams();
	const workspaceid = params.workspaceid;
	if (!workspaceid) return <div>Missing workspace id</div>;
	return <Navigate to={`/workspaces/${workspaceid}/members`} replace />;
};

export default MembersRedirect;
