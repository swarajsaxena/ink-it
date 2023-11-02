'use client'

import Cover from '@/components/Cover'
import Toolbar from '@/components/Toolbar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const page = ({
  params,
}: {
  params: {
    documentId: Id<'documents'>
  }
}) => {
  const router = useRouter()
  const { data } = useSession()
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

  return (
    <div className='pt-[62px] h-full bg-background  dark:bg-[#1a1f28] pb-40'>
      <Cover url={document.coverImage as string} />
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default page
