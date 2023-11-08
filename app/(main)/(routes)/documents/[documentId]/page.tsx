'use client'

import Cover from '@/components/Cover'
import Editor from '@/components/Editor'
import Toolbar from '@/components/Toolbar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import { redirect, useParams, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { FileIcon } from 'lucide-react'
import Link from 'next/link'
import { Spinner } from '@/components/Spinner'
import ProtectedRoute from '@/components/ProtectedRoute'
import ChildrenDocuments from '@/app/(main)/_components/ChildrenDocuments'

const page = ({
  params,
}: {
  params: {
    documentId: Id<'documents'>
  }
}) => {
  const { data: session } = useSession()

  if (session === null) {
    return redirect('/')
  }

  const Editor = useMemo(
    () => dynamic(() => import('@/components/Editor'), { ssr: false }),
    []
  )

  const router = useRouter()
  const update = useMutation(api.documents.update)

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
    userId: session?.user?.email || '',
    preview: false,
  })

  const documents = useQuery(api.documents.getSidebar, {
    userId: session?.user?.email || '',
    parentDocument: document?._id,
  })

  if (document === undefined || documents === undefined) {
    return <div>loading...</div>
  }

  if (document === null) {
    return <div>not found</div>
  }

  const onChange = (content: string) => {
    update({
      userId: session?.user?.email || '',
      id: params.documentId,
      content,
    })
  }

  return (
    <ProtectedRoute>
      <div className='pt-[62px] h-max min-h-screen bg-background  dark:bg-[#1a1f28] pb-40'>
        <Cover url={document.coverImage as string} />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto pb-40 flex flex-col justify-stretch'>
          <Toolbar initialData={document} />
          <ChildrenDocuments documents={documents} />
          <Editor
            onChange={onChange}
            initialContent={document.content as string}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default page
