'use client'

import Cover from '@/components/Cover'
import Editor from '@/components/Editor'
import Toolbar from '@/components/Toolbar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

const page = ({
  params,
}: {
  params: {
    documentId: Id<'documents'>
  }
}) => {
  const Editor = useMemo(
    () => dynamic(() => import('@/components/Editor'), { ssr: false }),
    []
  )

  const router = useRouter()
  const { data } = useSession()
  const update = useMutation(api.documents.update)
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
    userId: data?.user?.email || '',
  })

  if (document === undefined) {
    return <div>loading...</div>
  }

  if (document === null) {
    return <div>not found</div>
  }

  const onChange = (content: string) => {
    update({
      userId: data?.user?.email || '',
      id: params.documentId,
      content,
    })
  }

  return (
    <div className='pt-[62px] h-full bg-background  dark:bg-[#1a1f28] pb-40'>
      <Cover url={document.coverImage as string} />
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto pb-40 flex flex-col justify-stretch'>
        <Toolbar initialData={document} />
        <Editor
          onChange={onChange}
          initialContent={document.content as string}
        />
      </div>
    </div>
  )
}

export default page
