import { Doc } from '@/convex/_generated/dataModel'
import React, { ElementRef, useRef, useState } from 'react'
import IconPicker from './IconPicker'
import { Button } from './ui/button'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSession } from 'next-auth/react'
import TextareaAutosize from 'react-textarea-autosize'

const Toolbar = ({
  initialData,
  preview,
}: {
  initialData: Doc<'documents'>
  preview?: boolean
}) => {
  const { data } = useSession()
  const inputRef = useRef<ElementRef<'textarea'>>(null)
  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)

  let [isEditing, setIsEditing] = useState(false)
  let [value, setValue] = useState(initialData.title)

  const enableInput = () => {
    if (preview) return
    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onInput = (val: string) => {
    setValue(val)
    update({
      userId: data?.user?.email || '',
      title: value || 'Untitled',
      id: initialData._id,
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      disableInput()
    }
  }

  const onIconSelect = (icon: string) => {
    update({
      userId: data?.user?.email || '',
      id: initialData._id,
      icon: icon,
    })
  }

  const onIconRemove = () => {
    removeIcon({
      id: initialData._id,
      userId: data?.user?.email || '',
    })
  }

  return (
    <div className='pl-[54px] group relative'>
      {!!initialData.icon ? (
        !preview ? (
          <div className='flex items-center gap-2 group-icon pt-6'>
            <IconPicker
              asChild
              onChange={onIconSelect}
            >
              <p className='text-6xl hover:opacity-75 transition'>
                {initialData.icon}
              </p>
            </IconPicker>
            <Button
              onClick={onIconRemove}
              className='rounded-full opacity-0 group-hover:opacity-100 transition text-muted-foreground text-xs'
              variant={'outline'}
              size={'icon'}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          <p className='text-6xl pt-6'>{initialData.icon}</p>
        )
      ) : null}
      <div className='opacity-0 group-hover:opacity-100 flex items-center gap-1 py-4'>
        {!initialData.icon && !preview && (
          <IconPicker
            asChild
            onChange={onIconSelect}
          >
            <Button
              className='text-muted-foreground text-start'
              variant={'outline'}
              size={'sm'}
            >
              <Smile className='h-4 w-4 mr-2' />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            className='text-muted-foreground text-start'
            variant={'outline'}
            size={'sm'}
          >
            <ImageIcon className='h-4 w-4 mr-2' />
            Add Cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className='text-5xl bg-transparent font-bold break-words outline-none text-muted-foreground resize-none'
        />
      ) : (
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-5xl font-bold break-words outline-none text-muted-foreground'
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar
