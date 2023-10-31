'use client'

import { useEffect, useState } from 'react'
import SettingsModal from '@/components/modals/SettingsModal'

export const ModalProvider = () => {
  let [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <SettingsModal />
    </>
  )
}
