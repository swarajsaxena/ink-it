import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { ChevronRight, FileTextIcon, LucideIcon } from 'lucide-react'
import React, { MouseEventHandler } from 'react'

const Item = ({
  onClick,
  icon: Icon,
  label,
  active,
  documentIcon,
  expanded,
  id,
  isSearch,
  level = 0,
  onExpand,
  className,
}: {
  onClick: MouseEventHandler<HTMLDivElement>
  onExpand?: () => null
  icon: LucideIcon
  label: String
  id?: Id<'document'>
  documentIcon?: String
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  className?: string
}) => {
  return (
    <div
      onClick={onClick}
      role='button'
      className={cn(
        'pl-4 group py-2 pr-3 w-full hover:bg-primary/5 flex gap-2 items-center text-muted-foreground font-medium',
        className,
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!id && (
        <div
          role='button'
          className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1'
          onClick={() => {}}
        >
          <ChevronRight className='h-5' />
        </div>
      )}
      {documentIcon ? (
        <span className=''>{documentIcon}</span>
      ) : (
        <Icon className='h-4' />
      )}
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium'>
          <span className=''>CTRL</span>K
        </kbd>
      )}
    </div>
  )
}

export default Item
