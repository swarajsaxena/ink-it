'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const page = () => {
  const { data } = useSession()
  return (
    <div className='bg-secondary h-full flex flex-col items-center justify-center space-y-4 border'>
      <Image
        src='/empty.png'
        height={300}
        width={300}
        alt='empty'
        className='dark:hidden'
      />
      <Image
        src='/empty-dark.png'
        height={300}
        width={300}
        alt='empty'
        className='hidden dark:block'
      />

      <h2 className='text-lg font-medium'>
        Welcome To {data?.user?.name}'s Ink It
      </h2>
      <Button className='flex items-center gap-2'>
        <PlusCircle className='h-4 w-4' />
        <span>Create a note</span>
      </Button>
    </div>
  )
}

export default page
