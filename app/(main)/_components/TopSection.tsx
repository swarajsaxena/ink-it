import React from 'react'
import UserItem from './UserItem'
import { PlusCircle, SearchIcon, Settings } from 'lucide-react'
import Item from './Item'
import { useSearch } from '@/hooks/useSearch'

const TopSection = ({ handleCreate }: { handleCreate: () => void }) => {
  const toggle = useSearch((store) => store.toggle)
  return (
    <div className='flex flex-col'>
      <UserItem />
      <Item
        onClick={toggle}
        label='Search'
        isSearch
        icon={SearchIcon}
        className='text'
      />
      <Item
        onClick={() => {}}
        label='Settings'
        icon={Settings}
        className='text'
      />
      <Item
        onClick={handleCreate}
        label='New Page'
        icon={PlusCircle}
        className=''
      />
    </div>
  )
}

export default TopSection
