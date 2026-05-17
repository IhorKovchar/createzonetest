import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/searchCreators", "/chat", "/notification", "/setting", "/post/create"]

export default auth((req) => {
    // const { pathname } = req.nextUrl
    const isLogin = req.auth != null
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    // const session = req.auth

    if(!isLogin && isProtectedRoute) {
        return NextResponse.redirect(new URL("/user/login", req.url))
    }

    // const url = new URL("/api/sync-theme", req.url)
    // url.searchParams.set("redirectTo" , pathname)

    // if(session?.user?.id) {
    //     return NextResponse.redirect(url)
    // }

    return NextResponse.next()

});


export const config = {
    matcher: ["/((?!api/image|api/video|api/avatar|_next/static|_next/image|favicon.ico).*)"]
}