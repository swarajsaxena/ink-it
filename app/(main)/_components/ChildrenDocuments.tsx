import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { ChevronRight, FileIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const ChildrenDocuments = ({
  documents,
}: {
  documents: Doc<'documents'>[] | undefined
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const create = useMutation(api.documents.create)
  const { data } = useSession()

  const onCreate = async (event: any, parentId: Id<'documents'>) => {
    event.stopPropagation()
    toast({
      title: 'Loading..',
      description: 'Creating a new note !!',
    })

    if (!parentId) {
      toast({
        title: 'Id Missig',
        variant: 'destructive',
      })
      return
    }

    await create({
      title: 'Untitled !!',
      userId: data?.user?.email || '',
      parentDocument: parentId,
    })
      .then((id) => {
        router.push(`/documents/${id}`)
        toast({
          title: 'Success 🎉',
          description: 'New note created !!',
        })
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || err,
          variant: 'destructive',
        })
      })
  }
  return (
    documents &&
    documents?.length > 0 && (
      <div className='text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 px-[48px] py-4 [direction : rtl;]'>
        {documents
          ?.slice()
          .reverse()
          .map((child) => (
            <div className='flex items-center gap-2 group [direction : ltr;]'>
              <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-all' />
              <Link className='w-full' href={`/documents/${child._id}`}>
                <Button
                  variant={'default'}
                  size={'sm'}
                  className='font-normal h-auto py-1 px-2 max-w-full  bg-secondary hover:text-muted dark:hover:bg-primary text-foreground dark:hover:text-primary-foreground w-full truncate flex justify-start'
                >
                  {!!child.icon && <p className='mr-1'>{child.icon}</p>}
                  {child.title}
                </Button>
              </Link>
            </div>
          ))}
        <div className='flex items-center gap-2 group'>
          <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-all opacity-0' />
          <Button
            onClick={(e) =>
              onCreate(e, documents[0].parentDocument as Id<'documents'>)
            }
            variant={'default'}
            size={'sm'}
            className='font-normal h-auto py-1 px-2 max-w-full  bg-secondary hover:text-muted dark:hover:bg-primary text-foreground dark:hover:text-primary-foreground w-full truncate flex justify-start border-input'
          >
            <p className='mr-1'>Create a new document under this..</p>
          </Button>
        </div>
      </div>
    )
  )
}

export default ChildrenDocuments
