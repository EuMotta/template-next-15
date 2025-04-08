/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          /*           const response = await authLogin({
            email: credentials.email,
            password: credentials.password
          }); */

          /*          if (
            !response?.data?.user ||
            !response?.data?.token ||
            response?.error
          ) {
            throw new Error(response.message);
          } */

          return {
            id: '1',
            name: 'Dev User',
            last_name: 'Test',
            email: credentials.email,
            token: 'fake-local-token'
          };
        } catch (error: any) {
          console.error(error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            throw new Error(error.response.data.message);
          }
          return null;
        }
      }
    })
  ],
  session: {
    maxAge: 36000
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session && session.user) {
        session.user.email = token.email;
        session.token = token.token;
      }
      return session;
    }
  },
  pages: {
    signIn: '/entrar',
    error: '/error'
  }
};
