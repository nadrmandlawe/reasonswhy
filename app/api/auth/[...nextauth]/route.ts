// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       role: string;
//     }
//   }
//   interface User {
//     id: string;
//     name: string;
//     role: string;
//   }
//   interface JWT {
//     role?: string;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Admin Login",
//       credentials: {
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (credentials?.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
//           return {
//             id: "1",
//             name: "Admin",
//             role: "admin"
//           };
//         }
//         return null;
//       }
//     })
//   ],
//   pages: {
//     signIn: '/login',
//     error: '/login', // Error code passed in query string as ?error=
//   },
//   callbacks: {
//     async signIn({ user }) {
//       if (user) return true;
//       return false;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           role: token.role ?? 'user'
//         }
//       };
//     },
//     async redirect({ url, baseUrl }) {
//       // If already on login page and authenticated, go to admin dashboard
//       if (url.includes('/login')) {
//         return `${baseUrl}/admin`;
//       }
//       // Allows relative callback URLs
//       if (url.startsWith("/")) {
//         return `${baseUrl}${url}`;
//       }
//       // Allows callback URLs on the same origin
//       else if (new URL(url).origin === baseUrl) {
//         return url;
//       }
//       return `${baseUrl}/admin`;
//     }
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60 // 24 hours
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === "development"
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST }; 
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    name: string;
    role: string;
  }

  interface JWT {
    role?: string;
  }
}


const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Admin Login",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
          return {
            id: "1",
            name: "Admin",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      return !!user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role ?? "user",
        },
      };
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/login")) {
        return `${baseUrl}/admin`;
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/admin`;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
