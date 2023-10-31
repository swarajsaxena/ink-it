'use client'

import { cn } from '@/lib/utils'
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  PlusIcon,
  SearchIcon,
  Settings,
  Trash2,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useRef, ElementRef, useState, useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './UserItem'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Item from './Item'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import DocumentList from './DocumentList'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import TrashBox from './TrashBox'

const Navigation = () => {
  const { data } = useSession()
  const { toast } = useToast()
  const create = useMutation(api.documents.create)
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  let [isResetting, setIsResetting] = useState(false)
  let [isCollapsed, setIsCollapsed] = useState(isMobile)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return

    let newWidth = e.clientX

    if (newWidth < 320) newWidth = 320
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : '320px'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100%-320px)'
      )
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '320px')

      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')

      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }
  }

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleCreate = async () => {
    toast({
      title: 'Loading..',
      description: 'Creating a new note !!',
    })
    await create({
      title: 'Untitled',
      userId: data?.user?.email || '',
    })
      .then((val) => {
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
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-background overflow-y-auto flex w-80 flex-col z-[99999] relative',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <div
          role='button'
          className={cn(
            'p-1 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-3 opacity-0 group-hover/sidebar:opacity-100 transition-all',
            isMobile && 'opacity-100'
          )}
          onClick={collapse}
        >
          <ChevronsLeft className='text-xl' />
        </div>
        <div className='p-4 text-xl font-bold'>Ink It</div>
        <div className='flex flex-col'>
          <UserItem />
          <Item
            onClick={() => {}}
            label='Search'
            isSearch
            icon={SearchIcon}
            className='text'
          />
          <Item
            onClick={() => {}}
            label='Settings'
            icon={Settings}
            className='text'
          />
          <Item
            onClick={handleCreate}
            label='New Page'
            icon={PlusCircle}
            className=''
          />
        </div>
        <div className='mt-4 overflow-y-auto max-h-full pb-4'>
          <DocumentList />

          <Item
            onClick={handleCreate}
            icon={Plus}
            label={'Add a page'}
          />
        </div>
        <Popover>
          <PopoverTrigger className='mt-auto'>
            <div className='p-2'>
              <div className='flex text-muted-foreground p-1 items-center gap-1 hover:bg-primary rounded-sm transition-all cursor-pointer hover:text-white'>
                <Trash2 className='h-4' />
                Trash
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isMobile ? 'bottom' : 'right'}
            className='p-0 w-72 border-muted-foreground/20 mb-2 ml-1'
          >
            <TrashBox />
          </PopoverContent>
        </Popover>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/20 right-0 top-0'
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-320px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <nav className='bg-transparent p-2 w-full'>
          {isCollapsed && (
            <MenuIcon
              role='button'
              onClick={resetWidth}
              className='text-muted-foreground'
            />
          )}
        </nav>
      </div>
    </>
  )
}

export default Navigation
