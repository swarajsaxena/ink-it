import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  secret: 'ink_it_swaraj_saxena_240900',
  providers: [
    GoogleProvider({
      clientId:
        '402397592714-bn0sirekfmfci1gmdhet32q804mh6uma.apps.googleusercontent.com',
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
