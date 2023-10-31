import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
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
  Trash,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { HTMLAttributes, MouseEventHandler } from 'react'

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
  styles?: HTMLAttributes<HTMLDivElement>
}) => {
  const { toast } = useToast()
  const router = useRouter()
  const { data } = useSession()
  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive)

  const onArchive = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!docId) {
      toast({
        title: 'Id Missig',
        variant: 'destructive',
      })
      return
    }

    archive({ userId: data?.user?.email || '', id: docId })
      .then((id) => {
        toast({
          title: 'Success 🎉',
          description: 'Note Archived !!',
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
          title: 'Error',
          description: err.message || err,
          variant: 'destructive',
        })
      })
  }
  return (
    <div
      onClick={onClick}
      role='button'
      style={{
        paddingLeft: level ? `${(level + 1) * 12}px` : docId ? '12px' : '20px',
      }}
      className={cn(
        'group py-2 pr-3 w-full hover:bg-secondary/50 flex gap-4 items-center text-muted-foreground font-medium',
        className,
        active && 'bg-secondary dark:text-primary-foreground'
      )}
    >
      {!!docId && (
        <div
          role='button'
          className='group-hover:opacity-120 h-full rounded-sm hover:bg-primary/10 p-1'
          onClick={handleExpand}
        >
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-all',
              expanded ? 'rotate-90' : 'rotate-0'
            )}
          />
        </div>
      )}
      {documentIcon ? (
        <span className=''>{documentIcon}</span>
      ) : (
        <Icon className='w-4 h-4 -ml-1' />
      )}
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium'>
          <span className=''>CTRL</span>K
        </kbd>
      )}
      {!!docId && (
        <div className='flex items-center gap-x-2 ml-auto'>
          <div
            role='button'
            onClick={onCreate}
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary/10 p-1'
          >
            <PlusIcon className={cn('w-4 h-4 text-muted-foreground')} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <div
                role='button'
                className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-primary/10 p-1'
              >
                <MoreHorizontal
                  className={cn('w-4 h-4 text-muted-foreground')}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-60 border-muted-foreground/20 z-[9999999]'
              align='start'
              side='right'
              forceMount
            >
              <div
                onClick={onArchive}
                className='p-2 flex items-center hover:bg-red-500 hover:text-white rounded-sm transition-all cursor-pointer'
              >
                <Trash className='h-4 w-4 mr-2' />
                Delete
              </div>
              <DropdownMenuSeparator />
              <div className='text-xs text-muted-foreground p-2'>
                Last Edited By: {data?.user?.name}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${(level + 1) * 12}px` : '12px' }}
      className='flex gap-x-4 py-1'
    >
      <Skeleton className='h-5 w-5' />
      <Skeleton className='h-5 w-[30%]' />
    </div>
  )
}

export default Item
