import { type RouteConfig, index, layout ,route} from "@react-router/dev/routes";

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
    layout("./routes/dashboard/dashboard.tsx",[
        route("dashboard","routes/dashboard/index.tsx"),
        route("workspaces","routes/dashboard/workspaces/index.tsx"),
        route("workspaces/:workspaceid","routes/dashboard/workspaces/workspaceDetails.tsx"),
        route("workspaces/:workspaceid/projects/:projectid","routes/dashboard/project/projectDetails.tsx"),
        route("workspaces/:workspaceid/projects/:projectid/tasks/:taskid","routes/dashboard/tasks/taskdetails.tsx"),
    ])
] satisfies RouteConfig;
