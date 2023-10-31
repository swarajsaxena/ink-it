'use client'

import React, { MouseEventHandler } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

const ConfirmModal = ({
  children,
  onConfirm,
}: {
  children: React.ReactNode
  onConfirm: () => void
}) => {
  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    onConfirm()
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        onClick={(e) => e.stopPropagation()}
        asChild
      >
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className='z-[99999]'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This is an irreversible action !!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal
