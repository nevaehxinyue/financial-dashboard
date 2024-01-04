import { NextAuthConfig } from "next-auth";


export const authConfig = {
    // 'pages' option can be used to specify the route for custom sign-in,
    //sign-out, and error pages 
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({auth, request: { nextUrl }}) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            //If the use is either not trying to access a protected
            //route  or is not logged in and trying to access a non-protected route, 
            //In this case, the user is authorized to proceed.
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
