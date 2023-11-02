import { Doc } from '@/convex/_generated/dataModel'
import React, { ElementRef, useRef, useState } from 'react'
import IconPicker from './IconPicker'
import { Button } from './ui/button'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSession } from 'next-auth/react'
import TextareaAutosize from 'react-textarea-autosize'
import { useCoverImage } from '@/hooks/useCoverImage'

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

  const converImage = useCoverImage()

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
    <div className='pl-[54px] group relative -space-y-2'>
      {!!initialData.icon ? (
        !preview ? (
          <div className='flex items-center gap-2 group-icon relative w-max -ml-[10px]'>
            <IconPicker
              asChild
              onChange={onIconSelect}
            >
              <p className='text-7xl cursor-pointer hover:opacity-75 transition'>
                {initialData.icon}
              </p>
            </IconPicker>
            <div
              onClick={onIconRemove}
              className='absolute -right-1 -bottom-1 rounded-full opacity-0 group-hover:opacity-100 transition text-muted-foreground text-xs cursor-pointer border border-transparent hover:border-input p-1 bg-background/70 hover:bg-background'
            >
              <X className='h-4 w-4' />
            </div>
          </div>
        ) : (
          <p className='text-6xl pt-6'>{initialData.icon}</p>
        )
      ) : null}
      <div className='opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 pt-6 pb-3 -ml-[10px]'>
        {!initialData.icon && !preview && (
          <IconPicker
            asChild
            onChange={onIconSelect}
          >
            <Button
              className='text-muted-foreground text-start px-2 py-1 h-auto'
              variant={'ghost'}
              size={'sm'}
            >
              <Smile className='h-4 w-4 mr-1' />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={converImage.onOpen}
            className='text-muted-foreground text-start px-2 py-1 h-auto'
            variant={'ghost'}
            size={'sm'}
          >
            <ImageIcon className='h-4 w-4 mr-1' />
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
