'use client'

import { useCoverImage } from '@/hooks/useCoverImage'
import { Dialog, DialogHeader, DialogContent } from '../ui/dialog'
import { SingleImageDropzone } from '../SingleImageDropzon'
import { useState } from 'react'
import { useEdgeStore } from '@/lib/edgestore'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { useToast } from '../ui/use-toast'

const CoverImageModal = () => {
  const coverImage = useCoverImage()
  let [file, setFile] = useState<File>()
  let [progress, setprogress] = useState<number>(0)
  let [isSubmitting, setIsSubmitting] = useState(false)
  const { data } = useSession()
  const update = useMutation(api.documents.update)
  const params = useParams()
  const { toast } = useToast()

  const { edgestore } = useEdgeStore()

  const onClose = () => {
    setIsSubmitting(false)
    setFile(undefined)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      await edgestore.publicFiles
        .upload({
          file,
          onProgressChange: (prog) => {
            setprogress(prog)
          },
          options: {
            replaceTargetUrl: coverImage?.url || undefined,
          },
        })
        .then((file) => {
          update({
            id: params.documentId as Id<'documents'>,
            userId: data?.user?.email || '',
            coverImage: file.url,
          }).then(() => {
            toast({
              title: 'Success 🎉',
              description: 'Cover File Uploaded',
            })
          })
        })
        .catch((e) => {
          toast({
            title: 'Error Uploading Image',
            variant: 'destructive',
            description: e.message || e,
          })
        })

      onClose()
    }
  }

  return (
    <Dialog
      open={coverImage.isOpen}
      onOpenChange={coverImage.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semibold'>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
          progress={progress}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal
