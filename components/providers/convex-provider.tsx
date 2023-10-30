'use client'

import { ReactNode } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(
  'https://colorless-sparrow-529.convex.cloud'
)

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
