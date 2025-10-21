import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest){
    const path=request.nextUrl.pathname
    const isPublicPath= path==='/auth/login' || path==='/auth/signup'
    const token= request.cookies.get('token')?.value || ''
    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/admin',request.nextUrl))
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/auth/login',request.nextUrl))
    }
}

export const config={
    matcher:[
        '/admin/:path*',
    ]
}