import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Menu } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import React from 'react'
import Title from './Title'

const Navbar = ({
  isCollapsed,
  onResetWidth,
}: {
  isCollapsed: boolean
  onResetWidth: () => void
}) => {
  const params = useParams()
  const { data } = useSession()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
    userId: data?.user?.email || '',
  })

  if (document === undefined) {
    return (
      <nav className='bg-background px-3 py-2 w-full flex items-center gap-2 text-muted-foreground pt-4'>
        <Title.Skeleton />
      </nav>
    )
  }

  if (document === null) {
    return null
  }

  return (
    <>
      <div className='bg-background px-3 py-2 w-full flex items-center gap-2 text-muted-foreground'>
        {isCollapsed && (
          <Menu
            role='button'
            onClick={onResetWidth}
            className='h-6 w-6'
          />
        )}
        <div className='flex items-center justify-between w-full'>
          <Title initialData={document} />
        </div>
      </div>
    </>
  )
}

export default Navbar
