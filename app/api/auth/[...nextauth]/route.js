import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {},

  async signIn({ profile }) {
    try {
      await connectToDB();
      //check if a user is exit

      const userExists = await User.findOne({
        email: profile.email,
      });

      //if not create a new user
      if(!userExists) {
        await User.create({
            email: User.email,
            username: profile.name
        })
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

export { handler as get, handler as POST };
