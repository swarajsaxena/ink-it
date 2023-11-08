import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'

import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import '@blocknote/core/style.css'
import { useTheme } from 'next-themes'
import { useEdgeStore } from '@/lib/edgestore'

const Editor = ({
  initialContent,
  onChange,
  editable = true,
}: {
  onChange: (val: string) => void
  initialContent: string
  editable?: boolean
}) => {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    })
    return res.url
  }

  const editor: BlockNoteEditor = useBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange(editor) {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload,
    editable: editable,
  })
  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      className='outline-none focus:outline-none w-full'
    />
  )
}

export default Editor
