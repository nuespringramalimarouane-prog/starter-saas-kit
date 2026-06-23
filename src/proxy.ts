import { auth } from "@/auth"

export const proxy = auth((req)=>{

 const logged = !!req.auth


 const dashboard =
 req.nextUrl.pathname.startsWith("/dashboard")


 const authPage =
 req.nextUrl.pathname === "/login" ||
 req.nextUrl.pathname === "/register"


 if(dashboard && !logged){

   return Response.redirect(
    new URL("/login", req.url)
   )

 }


 if(authPage && logged){

   return Response.redirect(
    new URL("/dashboard", req.url)
   )

 }

})


export const config = {
 matcher:[
   "/dashboard/:path*",
   "/login",
   "/register"
 ]
}