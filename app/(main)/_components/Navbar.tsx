import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { ChevronRight, Menu, MoreHorizontal, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import Title from './Title'
import { Button } from '@/components/ui/button'
import Banner from './Banner'
import MoreOptions from './Menu'
import Publish from './Publish'

const Navbar = ({
  isCollapsed,
  onResetWidth,
}: {
  isCollapsed: boolean
  onResetWidth: () => void
}) => {
  const params = useParams()
  const router = useRouter()
  const { data } = useSession()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
    userId: data?.user?.email || '',
    preview: false,
  })

  const parents = useQuery(api.documents.getDocumentHierarchy, {
    iniId: params.documentId as Id<'documents'>,
    userId: data?.user?.email || '',
  })

  if (document === undefined) {
    return (
      <nav className='bg-background px-3 py-2 w-full flex items-center gap-2 text-muted-foreground pt-4 justify-between border-b-2 border-input'>
        <Title.Skeleton />
        <MoreOptions.Skeleton />
      </nav>
    )
  }

  if (document === null) {
    return null
  }

  const newParents = parents?.slice().reverse()

  return (
    <>
      <div className='bg-background dark:bg-[#1a1f28] px-3 py-3 w-full flex items-center gap-2 text-muted-foreground border-b-2 border-input'>
        {isCollapsed && (
          <Menu
            role='button'
            onClick={onResetWidth}
            className='h-6 w-6'
          />
        )}
        <Button
          size={'icon'}
          className='h-auto px-0 w-max p-1 font-normal capitalize aspect-square rounded-md grid place-content-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'
          variant={'ghost'}
          onClick={() => router.push('/documents')}
        >
          <X className='w-4 h-4' />
        </Button>
        <div className='flex items-center gap-2 justify-between w-full'>
          <div className='flex items-center gap-2'>
            {newParents
              ? newParents.length > 4
                ? newParents
                    .slice(newParents.length - 1 - 3, newParents.length - 1)
                    .map((parent, index) =>
                      index === 0 ? (
                        <>
                          {true && (
                            <>
                              <div
                                onClick={() => {
                                  router.push(`/documents/${parent.id}`)
                                }}
                                className='font-normal capitalize aspect-square rounded-md grid place-content-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'
                              >
                                <MoreHorizontal className='w-4 h-4' />
                              </div>
                              <ChevronRight className='w-4 h-4' />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              router.push(`/documents/${parent.id}`)
                            }}
                            variant={'ghost'}
                            size={'sm'}
                            className='font-normal capitalize px-1 py-[2px] h-auto'
                          >
                            {parent.icon && (
                              <span className='mr-1'>{parent.icon}</span>
                            )}
                            {parent.title}
                          </Button>
                          <span>
                            <ChevronRight className='w-4 h-4' />
                          </span>
                        </>
                      )
                    )
                : newParents.map(
                    (parent, index) =>
                      index !== newParents.length - 1 && (
                        <>
                          <Button
                            onClick={() => {
                              router.push(`/documents/${parent.id}`)
                            }}
                            variant={'ghost'}
                            size={'sm'}
                            className='font-normal capitalize px-1 py-[2px] h-auto'
                          >
                            {parent.icon && (
                              <span className='mr-1'>{parent.icon}</span>
                            )}
                            {parent.title}
                          </Button>
                          <span>
                            <ChevronRight className='w-4 h-4' />
                          </span>
                        </>
                      )
                  )
              : null}
            <Title initialData={document} />
          </div>
          <div className='flex items-center gap-1'>
            <Publish initialData={document} />
            <MoreOptions docId={document._id} />
          </div>
        </div>
      </div>
      {document.isArchived && <Banner docId={document._id} />}
    </>
  )
}

export default Navbar
