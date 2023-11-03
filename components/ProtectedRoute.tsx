import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession()

  if (session === null) {
    return redirect('/')
  }
  return <>{children}</>
}

export default ProtectedRoute
