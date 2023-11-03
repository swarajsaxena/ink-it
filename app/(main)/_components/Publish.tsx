import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import useOrigin from '@/hooks/useOrigin'
import { useMutation } from 'convex/react'
import {
  ArrowUpRightIcon,
  ArrowUpRightSquare,
  CheckIcon,
  CopyIcon,
  Globe,
  Link,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

const Publish = ({ initialData }: { initialData: Doc<'documents'> }) => {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)
  const { data } = useSession()
  const { toast } = useToast()

  let [copied, setCopied] = useState(false)
  let [isSubmitting, setIsSubmitting] = useState(false)
  const url = `${window?.location?.origin}/preview/${initialData._id}`

  const onPublish = () => {
    setIsSubmitting(true)
    toast({
      description: 'Publishing...',
    })

    update({
      id: initialData._id,
      isPublished: true,
      userId: data?.user?.email || '',
    })
      .then(() => {
        setIsSubmitting(false)
        toast({
          description: 'Published',
        })
      })
      .catch(() => {
        toast({
          description: 'Some Error Happened.',
        })
      })
  }

  const onUnpublish = () => {
    setIsSubmitting(true)
    toast({
      description: 'Unpublishing...',
    })

    update({
      id: initialData._id,
      isPublished: false,
      userId: data?.user?.email || '',
    })
      .then(() => {
        setIsSubmitting(false)
        toast({
          description: 'Unpublished',
        })
      })
      .catch(() => {
        toast({
          description: 'Some Error Happened.',
        })
      })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={'ghost'}
          size={'sm'}
        >
          Publish{' '}
          {initialData.isPublished && (
            <Globe className='w-4 h-4 ml-2 text-sky-500' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-72'
        align='end'
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Globe className='text-sky-500 animate-pulse h-4 w-4' />
              <p className='text-xs font-medium text-sky-500'>
                This note is live on web.
              </p>
            </div>
            <div className='flex items-center'>
              <input
                type='text'
                className='flex-1 px-2 text-xs border rounded-l-md h-[28px] bg-muted truncate'
                value={url}
                disabled
              />
              <Button
                size={'icon'}
                disabled={copied}
                className='rounded-l-none h-max p-2 w-max'
                onClick={onCopy}
              >
                {copied ? (
                  <CheckIcon className='h-3 w-3' />
                ) : (
                  <CopyIcon className='h-3 w-3' />
                )}
              </Button>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                disabled={isSubmitting}
                onClick={onUnpublish}
                className='w-full text-xs h-8'
                size={'sm'}
              >
                Unpublish
              </Button>
              <a
                href={url}
                target='_blank'
              >
                <Button
                  disabled={isSubmitting}
                  onClick={onUnpublish}
                  className='text-xs p-3 w-max rounded-md h-8'
                  size={'icon'}
                >
                  <Globe className='h-3 w-3' />
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <Globe className='h-8 w-8 text-muted-foreground mb-2' />
            <p className='text-sm font-medium mb-2'>Publish this note</p>
            <span className='text-xs to-muted-foreground mb-4'>
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className='w-full text-xs'
              size={'sm'}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default Publish
