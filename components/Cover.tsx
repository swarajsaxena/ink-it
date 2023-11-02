import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useState } from 'react'
import { Spinner } from './Spinner'
import { Button } from './ui/button'
import { ImageIcon, Redo, Redo2, X, XIcon } from 'lucide-react'
import { useCoverImage } from '@/hooks/useCoverImage'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { useToast } from './ui/use-toast'
import { useEdgeStore } from '@/lib/edgestore'

const Cover = ({ url, preview }: { url: string; preview?: boolean }) => {
  let [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const coverImage = useCoverImage()
  const params = useParams()
  const removCover = useMutation(api.documents.removeCoverImage)
  const { data } = useSession()
  const { edgestore } = useEdgeStore()
  const onRemove = () => {
    toast({
      description: 'Removing coover...',
    })
    edgestore.publicFiles
      .delete({
        url,
      })
      .then(() => {
        removCover({
          id: params.documentId as Id<'documents'>,
          userId: data?.user?.email || '',
        })
          .then(() => {
            toast({
              description: 'Cover Removed',
            })
          })
          .catch((e) => {
            toast({
              title: 'Something went wrong...',
              description: e.message,
              variant: 'destructive',
            })
          })
      })
  }
  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group flex items-center justify-center p-3',
        !url && 'h-[12vh]'
      )}
    >
      <div
        className={cn(
          'relative w-full h-full rounded-xl overflow-hidden',
          url && 'bg-muted'
        )}
      >
        {!!url && !preview && (
          <div className='absolute z-10 bottom-2 right-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-2'>
            <Button
              onClick={() => coverImage.onReplace(url)}
              className='text-muted-foreground text-start px-2 py-1 h-auto'
              variant={'secondary'}
              size={'sm'}
            >
              <ImageIcon className='h-4 w-4 mr-1' />
              Change Cover
            </Button>
            <Button
              onClick={onRemove}
              className='text-muted-foreground text-start px-2 py-1 h-auto'
              variant={'secondary'}
              size={'sm'}
            >
              <XIcon className='h-4 w-4 mr-1' />
              Remove Cover
            </Button>
          </div>
        )}
        {!!url && (
          <Image
            src={url}
            fill
            alt='cover'
            className='object-cover'
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
      {loading && url && (
        <div className='absolute w-full h-full flex justify-center items-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default Cover
