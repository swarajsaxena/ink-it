'use client'

import { BuiltInProviderType } from 'next-auth/providers/index'
import {
  signIn,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
  useSession,
} from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/Spinner'
import { redirect } from 'next/navigation'

const page = () => {
  const { data: session } = useSession()

  if (session) {
    // console.log(data?.user);
    return redirect('/documents')
  }
  
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
    <div className='min-h-full flex flex-col dark:bg-background'>
      <div className='flex p-4 w-full justify-between'>
        <div className='font-bold text-lg'>Ink It</div>
        <Dialog>
          <DialogTrigger>Log In</DialogTrigger>
          <DialogContent>
            <div className='flex flex-col gap-2 justify-center items-start'>
              <div className='font-medium mb-4'>Log In</div>

              {providers ? (
                Object.values(providers).map((provider) => {
                  return (
                    <Button
                      key={provider.name}
                      className='px-4 py-2 rounded-md w-full font-medium'
                      onClick={() => signIn(provider.id)}
                    >
                      Log in with {provider.name}
                    </Button>
                  )
                })
              ) : (
                <Spinner />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default page
