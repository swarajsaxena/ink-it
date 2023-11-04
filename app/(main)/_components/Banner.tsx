import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Banner = ({ docId }: { docId: Id<'documents'> }) => {
  const router = useRouter()
  const { data } = useSession()
  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)
  const { toast } = useToast()

  const onRemove = () => {
    toast({
      description: 'Removing Document.',
    })
    remove({
      id: docId,
      userId: data?.user?.email || '',
    })
      .then(() => {
        router.push('/documents')
        toast({
          description: 'Document Removed Permanently.',
        })
      })
      .catch((e) => {
        toast({
          title: 'Failed.',
          description: e.message || e,
        })
      })
  }
  const onRestore = () => {
    toast({
      description: 'Restoring Document.',
    })
    restore({
      id: docId,
      userId: data?.user?.email || '',
    })
      .then(() => {
        toast({
          description: 'Document Restored.',
        })
      })
      .catch((e) => {
        toast({
          title: 'Failed.',
          description: e.message || e,
        })
      })
  }

  return (
    <div className='w-full bg-rose-600 text-white flex items-center justify-center gap-2 p-2'>
      <p>This page is in the trash.</p>
      <Button
        onClick={onRestore}
        variant={'outline'}
        size={'sm'}
        className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
      >
        Restore
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          variant={'outline'}
          size={'sm'}
          className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
        >
          Delete
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default Banner
