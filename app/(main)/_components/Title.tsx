import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

const Title = ({ initialData }: { initialData: Doc<'documents'> }) => {
  const update = useMutation(api.documents.update)
  let [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data } = useSession()
  let [title, setTitle] = useState(initialData.title || 'Untitled')

  const enableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    update({
      id: initialData._id,
      title: e.target.value || 'Untitled',
      userId: data?.user?.email || '',
    })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      disableInput()
    }
  }

  return (
    <div className='flex items-center gap-1'>
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className='p-1 px-2 focus-visible:ring-transparent'
        />
      ) : (
        <Button
          onClick={enableInput}
          variant={'ghost'}
          size={'sm'}
          className='font-normal h-auto p-1 px-2'
        >
          {!!initialData.icon && <p>{initialData.icon}</p>}{' '}
          <span className='truncate'>{initialData.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className='h-4 w-20 rounded-md' />
}

export default Title
