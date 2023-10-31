'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import Navigation from './_components/Navigation'
import SearchCommand from '@/components/SearchCommand'

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession()

  if (session === null) {
    // console.log(data?.user);
    return redirect('/')
  }

  return (
    <div className='h-full flex dark:bg-background'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
