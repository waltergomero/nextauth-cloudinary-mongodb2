import bcryptjs from "bcryptjs";
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import User from "@/models/user";
import db from "@utils/db";

  const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/pages/account/login",
    //signOut: "/",
    error: "/auth/error", // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.role) token.role = user.role;
      if (user?.first_name) token.first_name = user.first_name;
      if (user?.last_name) token.last_name = user.last_name;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.role) session.user.role = token.role;
      if (token?.first_name) session.user.first_name = token.first_name;
      if (token?.last_name) session.user.last_name = token.last_name;
      return session;
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();

        const user = await User.findOne({
          email: credentials.email,
        });
        console.log("user info backend", user)
        await db.disconnect();

        if (!user) {
          throw new Error("User with this email doesn't exists.");
        }
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
          };
        }
        throw new Error("The password submitted is incorrect.");
      },
    }),
  ],
});
export { handler as GET, handler as POST }

//export default NextAuth(authOptions);

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import GitHubProvider from "next-auth/providers/github";

// import User from '@models/user';
// import { connectToDB } from '@utils/database';

// const handler = NextAuth({
//   providers: [
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_ID,
//     //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET
//     })
//   ],
//   callbacks: {
//     async session({ session }) {
//       // store the user id from MongoDB to session
//       const sessionUser = await User.findOne({ email: session.user.email });
//       session.user.id = sessionUser._id.toString();

//       return session;
//     },
//     async signIn({ account, profile, user, credentials }) {
//       try {
//         await connectToDB();

//         // check if user already exists
//         const userExists = await User.findOne({ email: profile.email });

//         // if not, create a new document and save user in MongoDB
//         // if (!userExists) {
//         //   await User.create({
//         //     email: profile.email,
//         //     username: profile.name.replace(" ", "").toLowerCase(),
//         //     image: profile.picture,
//         //   });
//         // }

//         return true
//       } catch (error) {
//         console.log("Error checking if user exists: ", error.message);
//         return false
//       }
//     },
//   }
// })

// export { handler as GET, handler as POST }