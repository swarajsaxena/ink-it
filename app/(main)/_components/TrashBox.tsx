import { Spinner } from '@/components/Spinner'
import ConfirmModal from '@/components/modals/ConfirmModal'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { ArchiveRestore, Delete, File, Search, Trash, Undo } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const TrashBox = () => {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { data } = useSession()
  const documents = useQuery(api.documents.getTrash, {
    userId: data?.user?.email || '',
  })
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)

  let [search, setSearch] = useState('')

  const filteredDocs = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  const onClick = (id: Id<'documents'>) => {
    router.push(`/documents/${id}`)
  }

  const onRestore = (
    e: React.MouseEvent<HTMLDivElement>,
    id: Id<'documents'>
  ) => {
    e.stopPropagation()

    toast({
      title: 'Loading !!',
      description: 'Restoring Note...',
    })
    restore({
      userId: data?.user?.email || '',
      id,
    })
      .then((id) => {
        toast({
          title: 'Sucess 🎉',
          description: 'Note Restored',
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

  const onRemove = (id: Id<'documents'>) => {
    toast({
      title: 'Loading !!',
      description: 'Removing Note...',
    })
    remove({
      userId: data?.user?.email || '',
      id,
    })
      .then((id) => {
        toast({
          title: 'Sucess 🎉',
          description: 'Note Removed',
        })
        if (params.documentId === id) {
          router.push('/documents')
        }
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || err,
          variant: 'destructive',
        })
      })
  }

  if (documents === undefined) {
    return (
      <div className='h-full flex items-center justify-center p-4'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-x-2 p-2'>
        <Search className='h-4 text-muted-foreground' />
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className='h-8 px-4 focus-visible:ring-transparent bg-secondary'
          placeholder='Filter By Page Title...'
        />
      </div>
      <div className='p-2 pt-0'>
        <p className='hidden last:block text-xs text-center text-muted-foreground py-2'>
          No Documents Found
        </p>
        {filteredDocs?.map((doc) => (
          <div
            key={doc._id}
            role='button'
            onClick={() => onClick(doc._id)}
            className=' rounded-sm text-muted-foreground w-full hover:bg-primary hover:text-white flex items-center  justify-between gap-1 pl-2'
          >
            <File className='h-3 w-3' />
            <span className='mr-auto truncate pr-2'>{doc.title}</span>
            <div className='flex items-center'>
              <div
                className='p-2 hover:bg-white/20 hover:text-white group rounded-sm'
                onClick={(e) => onRestore(e, doc._id)}
              >
                <Undo className='h-4 w-4' />
              </div>
              <ConfirmModal onConfirm={() => onRemove(doc._id)}>
                <div className='p-2 hover:bg-white/20 hover:text-white group rounded-sm'>
                  <Trash className='h-4 w-4' />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrashBox
