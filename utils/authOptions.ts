import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  secret: 'ink_it_swaraj_saxena_240900',
  providers: [
    GoogleProvider({
      clientId:
        '730204526238-jmabug0vfj8c6rd9pnnuj5q3r1q9n2k1.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    GithubProvider({
      clientId: 'Iv1.884af479c8216d98',
      clientSecret: '20a56856c7f5dc47c640a82c279868f981a411e8',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
}
