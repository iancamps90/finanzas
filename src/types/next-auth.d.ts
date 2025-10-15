import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      locale?: string
      currency?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    locale?: string
    currency?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    locale?: string
    currency?: string
  }
}
