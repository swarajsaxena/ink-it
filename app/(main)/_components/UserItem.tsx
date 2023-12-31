'use client'

import { Spinner } from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsUpDown } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const UserItem = () => {
  const { data } = useSession()
  let [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  return (
    <div className='mb-4'>
      {data ? (
        <>
          <div
            className='px-4 p-2 flex items-center gap-2 justify-between hover:bg-muted-foreground/5 transition-all cursor-pointer'
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              src={data.user?.image || ''}
              alt='user image'
              className='w-8 h-8 rounded-xl'
            />
            <div>{data?.user?.name}</div>
            <ChevronsUpDown
              width={16}
              height={16}
              className='ml-auto'
            />
          </div>
          <div
            className={cn(
              'overflow-hidden transition-all',
              !isProfileOpen ? 'h-0' : 'h-16'
            )}
          >
            <div className='px-4 py-2'>
              <Button
                onClick={() =>
                  signOut().then(() => {
                    router.push('/')
                  })
                }
                size={'sm'}
                variant={'secondary'}
                className='w-full'
              >
                Log Out
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default UserItem
