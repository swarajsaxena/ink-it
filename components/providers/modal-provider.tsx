'use client'

import { useEffect, useState } from 'react'
import SettingsModal from '@/components/modals/SettingsModal'
import CoverImageModal from '../modals/CoverImageModal'

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
      <CoverImageModal />
    </>
  )
}
