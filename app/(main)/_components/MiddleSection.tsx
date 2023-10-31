import React from 'react'
import DocumentList from './DocumentList'
import { Plus } from 'lucide-react'
import Item from './Item'

const MiddleSection = ({ handleCreate }: { handleCreate: () => void }) => {
  return (
    <div className='mt-4 overflow-y-auto max-h-full pb-4'>
      <DocumentList />

      <Item
        onClick={handleCreate}
        icon={Plus}
        label={'Add a page'}
      />
    </div>
  )
}

export default MiddleSection
