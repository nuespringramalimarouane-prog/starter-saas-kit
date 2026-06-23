import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize() {
        return null
      },
    }),
  ],
}

export default authConfig