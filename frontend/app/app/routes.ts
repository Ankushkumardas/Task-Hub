import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout('./routes/auth/authlayout.tsx', [
        index('./routes/root/home.tsx'),
        route('login', './routes/auth/login.tsx'),
        route('signup', './routes/auth/signup.tsx'),
        route('forgot-password', './routes/auth/forgotpassword.tsx'),
        route('reset-password', './routes/auth/resetpassword.tsx'),
        route('verify-email', './routes/auth/verifyemail.tsx'),
        route('*', './routes/notfound.tsx'), // catch-all route
    ]),
    layout("./routes/dashboard/dashboard.tsx", [
        route("dashboard", "routes/dashboard/index.tsx"),
        route("workspaces", "routes/dashboard/workspaces/index.tsx"),
        // more specific workspace child routes first so they don't get captured by the
        // parent `workspaces/:workspaceid` route
        route("workspaces/:workspaceid/projects/:projectid", "routes/dashboard/project/projectDetails.tsx"),
        route("workspaces/:workspaceid/projects/:projectid/tasks/:taskid", "routes/dashboard/tasks/taskdetails.tsx"),
        route("workspaces/:workspaceid", "routes/dashboard/workspaces/workspaceDetails.tsx"),
        //my-tasks
        route("my-tasks", "routes/mytasks/mytasks.tsx"),
        // member 
        // members routes (support multiple URL shapes)
        // shorthand `/members/:workspaceid` links
        route('workspaces/:workspaceid/members','routes/members/Members.tsx'),
        route('members/:workspaceid','routes/members/redirect.tsx'),
        //archive
        route("archieve/:workspaceid","routes/archieve/archieve.tsx"),
    ])
] satisfies RouteConfig;
