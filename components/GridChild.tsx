import React, { useState } from 'react'
import { Button } from './ui/button'
import { Doc } from '@/convex/_generated/dataModel'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import { useTheme } from 'next-themes'

const GridChild = async ({ child }: { child: Doc<'documents'> }) => {
  const { resolvedTheme } = useTheme()

  const editor: BlockNoteEditor = useBlockNote({
    initialContent: child.content
      ? (JSON.parse(child.content) as PartialBlock[])
      : undefined,
  })
  let [htmlContent, setHtmlContent] = useState(
    await editor.blocksToHTML(editor.topLevelBlocks)
  )
  return (
    <Button
      onClick={() => {
        // router.push(`/documents/${child._id}`)
      }}
      variant={'default'}
      size={'sm'}
      className='font-normal h-auto py-1 px-2 w-max max-w-full md:max-w-[50%] bg-foreground/10 hover:bg-primary/40 dark:hover:bg-primary text-foreground flex flex-col'
    >
      <div className='truncate flex'>
        {!!child.icon && <p className='mr-1'>{child.icon}</p>}
        {child.title}
      </div>
      {child.content && <div>{htmlContent}</div>}
    </Button>
  )
}

export default GridChild
