import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/signin",
  },
})

export const config = {
  matcher: [
    "/anime/:path*",
    "/collection/:path*",
    "/profile/:path*",
    "/top-anime/:path*",
  ],
}


