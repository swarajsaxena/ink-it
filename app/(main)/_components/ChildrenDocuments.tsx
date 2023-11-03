import { Button } from '@/components/ui/button'
import { Doc } from '@/convex/_generated/dataModel'
import { FileIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const ChildrenDocuments = ({
  documents,
}: {
  documents: Doc<'documents'>[] | undefined
}) => {
  const router = useRouter()
  return (
    documents &&
    documents?.length > 0 && (
      <div className='text-muted-foreground grid grid-cols-1 gap-x-2 gap-y-1 px-[48px] py-4'>
        {documents?.map((child) => (
          <>
            <Button
              onClick={() => {
                router.push(`/documents/${child._id}`)
              }}
              variant={'ghost'}
              size={'sm'}
              className='font-normal capitalize border border-input h-auto py-1 px-2 w-max max-w-full md:max-w-[50%]'
            >
              <div className='truncate flex'>
                {!!child.icon && <p className='mr-1'>{child.icon}</p>}
                {child.title}
              </div>
            </Button>
          </>
        ))}
      </div>
    )
  )
}

export default ChildrenDocuments
