import { getSession } from '@/utils/getSession'
import { NextResponse, NextRequest } from 'next/server'
// import { getSession } from './utils/getSession'

export async function middleware(request: NextRequest) {
  try {
    const { email } = await getSession(request)
    console.log('url:', request.url)

    const url = new URL(request.url)
    if (email) return NextResponse.redirect(new URL('/documents', request.url))
  } catch (error) {
    return NextResponse.json(error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
