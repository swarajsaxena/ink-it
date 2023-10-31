'use client'

import { useQuery } from 'convex/react'
import { File } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { useSearch } from '@/hooks/useSearch'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const SearchCommand = () => {
  const router = useRouter()
  const { data } = useSession()
  const documents = useQuery(api.documents.getSearch, {
    userId: data?.user?.email || '',
  })
  let [mounted, setMounted] = useState(false)

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: Id<'documents'>) => {
    router.push(`/documents/${id}`)
    onClose?.()
  }

  if (!mounted) return null

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <CommandInput
        placeholder={`Search ${data?.user?.name?.split(' ')[0]}'s Ink It...`}
      />
      <CommandList>
        <CommandEmpty>No Results Found</CommandEmpty>
        <CommandGroup heading='Docouments'>
          {documents?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc.title}`}
              title={doc.title}
              onSelect={() => onSelect(doc._id)}
              className='cursor-pointer'
            >
              {doc.icon ? (
                <p className='mr-2 text-lg'>{doc.icon}</p>
              ) : (
                <File className='mr-2 h-4 w-4' />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default SearchCommand
