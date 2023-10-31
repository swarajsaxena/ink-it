import React from 'react'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Trash2 } from 'lucide-react'
import TrashBox from './TrashBox'

const BottomSection = ({ isMobile }: { isMobile: boolean }) => {
  return (
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
  )
}

export default BottomSection
