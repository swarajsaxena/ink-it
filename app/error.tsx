'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

const error = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <div className='text-xl font-medium'>Somthing went wrong</div>
      <Button>
        <Link href={'/'}>Go Back</Link>
      </Button>
    </div>
  )
}

export default error
