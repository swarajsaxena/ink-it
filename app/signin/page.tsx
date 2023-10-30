'use client'

import { BuiltInProviderType } from 'next-auth/providers/index'
import {
  signIn,
  getSession,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
  useSession,
} from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const page = () => {
  const provider = getProviders()

  let [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null>()

  useEffect(() => {
    provider.then((val) => {
      setProviders(val)
    })
  }, [])

  return (
    <div className='flex items-center h-full'>
      <div className='flex-1 h-full p-4 pr-2'>
        <div className='h-full rounded-md relative overflow-hidden border border-emerald-950/20 flex items-center justify-center'>
          <Image
            src={'/wallpaper.png'}
            alt='wallpaper'
            fill
            className='object-cover scale-105 opacity-70'
          />
          <div className='bg-emerald-400 px-8 py-4 rounded-md uppercase text-2xl z-10 text-white'>
            SECRETS
          </div>
        </div>
      </div>
      <div className='flex-1 p-4 pl-2 h-full'>
        <div className='h-full bg-emerald-400 rounded-md flex items-center justify-center flex-col gap-4'>
          <h1 className='text-2xl text-center font-medium text-white w-max'>
            Login In
          </h1>
          {providers &&
            Object.values(providers).map((provider) => {
              return (
                <div key={provider.name}>
                  <button
                    className='bg-white px-4 py-2 rounded-md'
                    onClick={() => signIn(provider.id)}
                  >
                    Log in with {provider.name}
                  </button>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default page
