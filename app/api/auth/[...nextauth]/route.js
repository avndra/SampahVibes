import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Real authentication
        try {
          await connectDB();

          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error('No user found with this email');
          }

          if (user.isBanned) {
            throw new Error('This account has been banned');
          }

          const isValid = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            isBanned: user.isBanned
          };
        } catch (error) {
          console.error('Auth error:', error.message);
          throw new Error(error.message); // Rethrow specific error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.isBanned = user.isBanned; // Add isBanned to token
      }

      // Update session support (Triggered by update() on client)
      if (trigger === "update" && session?.isBanned !== undefined) {
        token.isBanned = session.isBanned;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.isBanned = token.isBanned; // Pass to client session
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };