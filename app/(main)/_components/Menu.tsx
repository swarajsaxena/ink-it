import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const MoreOptions = ({ docId }: { docId: Id<'documents'> }) => {
  const router = useRouter()
  const { data } = useSession()
  const archive = useMutation(api.documents.archive)
  const { toast } = useToast()

  const onArchive = () => {
    toast({
      description: 'Archiving Document.',
    })
    archive({
      id: docId,
      userId: data?.user?.email || '',
    })
      .then(() => {
        router.push('/documents')
        toast({
          description: 'Document Archived.',
        })
      })
      .catch((e) => {
        toast({
          title: 'Failed.',
          description: e.message || e,
        })
      })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          size={'sm'}
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-60'
        align='end'
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem
          onClick={onArchive}
          className='hover:bg-red-600 hover:text-white cursor-pointer'
        >
          <Trash className='h-4 w-4 mr-2' />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Last Edited By: {data?.user?.name}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

MoreOptions.Skeleton = function () {
  return <Skeleton className='h-6 w-6' />
}

export default MoreOptions
