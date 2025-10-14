import { type RouteConfig, index, layout ,route} from "@react-router/dev/routes";

export default [
    layout('routes/auth/authlayout.tsx',[
        index('routes/root/home.tsx'),
        route("login","routes/auth/login.tsx"),
        route('signup','routes/auth/signup.tsx'),
        route('forgot-password','routes/auth/forgotpassword.tsx'),
        route('reset-password','routes/auth/resetpassword.tsx'),
        route('verify-email','routes/auth/verifyemail.tsx'),
    ])
] satisfies RouteConfig;
