'use client'

import { BuiltInProviderType } from 'next-auth/providers/index'
import {
  signIn,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
  useSession,
} from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/Spinner'
import { redirect } from 'next/navigation'
import {
  Cloud,
  Github,
  Lightbulb,
  Linkedin,
  Moon,
  Settings,
  Sun,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import Link from 'next/link'

const page = () => {
  const { data: session } = useSession()
  const { setTheme } = useTheme()

  if (session) {
    // console.log(session?.user)
    // return redirect('/documents')
  }

  const provider = getProviders()

  let [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null>()

  useEffect(() => {
    document.body.style.overflow = ''
    provider.then((val) => {
      setProviders(val)
    })
  }, [])

  return (
    <div className='min-h-[100vh] flex flex-col dark:bg-background overflow-y-scroll'>
      <div className='flex p-4 pb-0 w-full items-center justify-between gap-2'>
        <div className='font-bold text-base md:text-xl'>Ink It</div>
        <Button
          className='p-2 ml-auto'
          variant={'link'}
        >
          <a
            href='https://github.com/swarajsaxena'
            // className='ml-auto px-4 py-2 hover:bg-muted rounded-md font-medium transition-all'
          >
            <Github className='w-4 h-4' />
          </a>
        </Button>
        <Button
          className='p-2 mr-4'
          variant={'link'}
        >
          <a
            href='https://www.linkedin.com/in/swaraj-saxena'
            // className='ml-auto px-4 py-2 hover:bg-muted rounded-md font-medium transition-all'
          >
            <Linkedin className='w-4 h-4' />
          </a>
        </Button>
        {session ? (
          <Link href={'/documents'}>
            <Button
              className='px-4 py-2'
              // onClick={() => redirect('/documents')}
            >
              {session.user?.name?.split(' ')[0]}'s Documents
            </Button>
          </Link>
        ) : (
          <Dialog>
            <DialogTrigger className='px-4 py-2 hover:bg-muted hover:text-primary bg-primary text-primary-foreground rounded-md font-medium transition-all text-sm'>
              Log In
            </DialogTrigger>
            <DialogContent>
              <div className='flex flex-col gap-2 justify-center items-start'>
                <div className='font-medium mb-4 '>Log In</div>

                {providers ? (
                  Object.values(providers).map((provider) => {
                    return (
                      <Button
                        key={provider.name}
                        className='px-4 py-2 rounded-md w-full font-medium'
                        onClick={() => signIn(provider.id)}
                      >
                        Log in with {provider.name}
                      </Button>
                    )
                  })
                ) : (
                  <Spinner />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='border-none outline-none text-primary focus:outline-none focus-visible:outline-none'
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex flex-col items-center justify-center min-h-[450px] gap-4'>
        <div className='text-6xl font-black'>
          Welcome To <span className='text-primary italic'>Ink It</span>
        </div>
        <div className='text-muted-foreground text-lg max-w-md text-center'>
          The most powerful note-taking app for innovators, thinkers, and
          creators.
        </div>
        {session ? (
          <Link href={'/documents'}>
            <Button
              className='px-4 py-2'
              // onClick={() => redirect('/documents')}
            >
              {session.user?.name?.split(' ')[0]}'s Documents
            </Button>
          </Link>
        ) : (
          <Dialog>
            <DialogTrigger className='px-4 py-2 hover:bg-muted hover:text-primary bg-primary text-primary-foreground rounded-md font-medium transition-all text-sm'>
              Log In
            </DialogTrigger>
            <DialogContent>
              <div className='flex flex-col gap-2 justify-center items-start'>
                <div className='font-medium mb-4 '>Log In</div>

                {providers ? (
                  Object.values(providers).map((provider) => {
                    return (
                      <Button
                        key={provider.name}
                        className='px-4 py-2 rounded-md w-full font-medium'
                        onClick={() => signIn(provider.id)}
                      >
                        Log in with {provider.name}
                      </Button>
                    )
                  })
                ) : (
                  <Spinner />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className='p-4 flex-1 flex items-stretch flex-col bg-muted'>
        <div className='flex-1 flex flex-col items-center justify-center gap-8'>
          <div className='font-bold text-3xl py-4'>Features</div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-8 w-full place-items-center h-max'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <div className='p-4 bg-primary/10 rounded-full'>
                <Cloud className='text-primary h-8 w-8' />
              </div>
              <div className='font-bold text-2xl'>Cloud</div>
              <div className='max-w-xs text-center text-muted-foreground'>
                Your notes are stored securely in the cloud and accessible from
                anywhere.
              </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-4'>
              <div className='p-4 bg-primary/10 rounded-full'>
                <Settings className='text-primary h-8 w-8' />
              </div>
              <div className='font-bold text-2xl'>Customisable</div>
              <div className='max-w-xs text-center text-muted-foreground'>
                Fully customizable to fit your workflow and boost your
                productivity.
              </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-4'>
              <div className='p-4 bg-primary/10 rounded-full'>
                <Lightbulb className='text-primary h-8 w-8' />
              </div>
              <div className='font-bold text-2xl'>Innovative</div>
              <div className='max-w-xs text-center text-muted-foreground'>
                NoteApp offers a unique and innovative approach to note-taking.
              </div>
            </div>
          </div>
        </div>
        <div className='flex text-sm flex-col justify-center items-center md:flex-row gap-4 text-muted-foreground'>
          <div className=''>
            Made By{' '}
            <a href=''>
              <Button
                className='p-0'
                variant={'link'}
              >
                Swaraj Saxena
              </Button>
            </a>
          </div>
          <a
            href='https://github.com/swarajsaxena'
            target='_blank'
          >
            <Button
              className='p-0'
              variant={'link'}
            >
              <Github className='h-4 w-4' />
            </Button>
          </a>
          <a
            href='https://www.linkedin.com/in/swaraj-saxena'
            target='_blank'
          >
            <Button
              className='p-0'
              variant={'link'}
            >
              <Linkedin className='h-4 w-4' />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default page
