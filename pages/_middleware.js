import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
	// Token will exist if user is logged in
	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	const { pathname } = req.nextUrl;

	// Allow the requests if the following is true..
	// if it is an authentication req or there is token present
	if (pathname.includes("/api/auth") || token) {
		return NextResponse.next();
	}
	
	// if there is no logged in user
	if (!token && pathname !== "/login") {
		return NextResponse.redirect("/login")
	}

}
