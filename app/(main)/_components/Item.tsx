import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import {
  ChevronRight,
  FileTextIcon,
  LucideIcon,
  MoreHorizontal,
  PlusIcon,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { MouseEventHandler } from 'react'

const Item = ({
  onClick,
  icon: Icon,
  label,
  active,
  documentIcon,
  expanded,
  docId,
  isSearch,
  level = 0,
  onExpand,
  className,
}: {
  onClick: MouseEventHandler<HTMLDivElement>
  onExpand?: Function
  icon: LucideIcon
  label: String
  docId?: Id<'documents'>
  documentIcon?: String
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  className?: string
}) => {
  const { toast } = useToast()
  const router = useRouter()
  const { data } = useSession()
  const create = useMutation(api.documents.create)
  const handleExpand = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    onExpand?.()
  }
  const onCreate = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    toast({
      title: 'Loading..',
      description: 'Creating a new note !!',
    })

    if (!docId) {
      toast({
        title: 'Id Missig',
        description: !docId ? 'yes' : 'np',
        variant: 'destructive',
      })
      return
    }

    await create({
      title: 'Untitled !!',
      userId: data?.user?.email || '',
      parentDocument: docId,
    })
      .then((id) => {
        if (!expanded) {
          onExpand?.()
        }
        // router.push(`/documents/${id}`)
        toast({
          title: 'Success 🎉',
          description: 'New note created !!',
        })
      })
      .catch((err) => {
        toast({
          title: 'New note created !!',
          description: err.message || err,
          variant: 'destructive',
        })
      })
  }
  return (
    <div
      onClick={onClick}
      role='button'
      style={{ paddingLeft: level ? `${(level + 1) * 16}px` : '16px' }}
      className={cn(
        'group py-2 pr-3 w-full hover:bg-primary/5 flex gap-2 items-center text-muted-foreground font-medium',
        className,
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!docId && (
        <div
          role='button'
          className=''
          onClick={handleExpand}
        >
          <ChevronRight
            className={cn('h-5', expanded ? 'rotate-90' : 'rotate-0')}
          />
        </div>
      )}
      {documentIcon ? (
        <span className=''>{documentIcon}</span>
      ) : (
        <Icon className='h-4 -ml-1' />
      )}
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium'>
          <span className=''>CTRL</span>K
        </kbd>
      )}
      {!!docId && (
        <div
          className='flex items-center gap-x-2 ml-auto'
          onClick={handleExpand}
        >
          <div
            role='button'
            onClick={onCreate}
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-200/10 p-1'
          >
            <PlusIcon className={cn('w-4 h-4 text-muted-foreground')} />
          </div>
          <div
            role='button'
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-200/10 p-1'
          >
            <MoreHorizontal className={cn('w-4 h-4 text-muted-foreground')} />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${(level + 1) * 16}px` : '16px' }}
      className='flex gap-x-2 py-1'
    >
      <Skeleton className='h-4 w-4' />
      <Skeleton className='h-4 w-[30%]' />
    </div>
  )
}

export default Item
