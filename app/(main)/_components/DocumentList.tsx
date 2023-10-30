import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Item from './Item'
import { FileIcon, FileTextIcon } from 'lucide-react'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const DocumentList = ({
  data,
  level = 0,
  parentDocId,
}: {
  parentDocId?: Id<'documents'>
  level?: number
  data?: Doc<'documents'>
}) => {
  const params = useParams()
  const router = useRouter()

  let [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { data: session } = useSession()

  const documents = useQuery(api.documents.getSidebar, {
    userId: session?.user?.email || '',
    parentDocument: parentDocId,
  })

  const onExpand = (docId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }))
  }

  const onRedirect = (docId: string) => {
    router.push(`/documents/${docId}`)
  }

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <div>
      <p
        style={{
          paddingLeft: level ? `${level * 14 + 14}px` : undefined,
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80 bg-primary/10',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
      >
        No Pages Inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            docId={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList
              parentDocId={document._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default DocumentList
