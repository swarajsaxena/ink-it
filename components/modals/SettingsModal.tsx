'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { useSettings } from '@/hooks/useSettings'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '../ModeToggle'

const SettingsModal = () => {
  const settings = useSettings()
  return (
    <Dialog
      open={settings.isOpen}
      onOpenChange={settings.onClose}
    >
      <DialogContent>
        <DialogHeader className='border-b pb-3'>
          <h2 className='text-lg font-medium'>My Settings</h2>
        </DialogHeader>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-1'>
            <Label>Appearance</Label>
            <span className='text-sm text-muted-foreground'>
              Customise how Ink It looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
