import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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

          // Google users might not have a password
          if (!user.password) {
            throw new Error('Please login with Google');
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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Auto-register Google user
            await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image, // Use Google avatar
              role: 'user', // Default role
              totalPoints: 0,
              totalWeight: 0,
              totalDeposits: 0
            });
          } else if (existingUser.isBanned) {
            return false; // Deny banned users
          }
          return true;
        } catch (error) {
          console.error('Values:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        // If login with Google, fetch user from DB to get the correct _id and role
        if (account?.provider === 'google') {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.isBanned = dbUser.isBanned;
          }
        } else {
          // Credentials login (user object is already correct from authorize)
          token.role = user.role;
          token.id = user.id;
          token.isBanned = user.isBanned;
        }
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