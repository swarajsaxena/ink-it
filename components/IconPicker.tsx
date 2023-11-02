import { useTheme } from 'next-themes'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import React, { ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const IconPicker = ({
  children,
  onChange,
  asChild,
}: {
  onChange: (val: string) => void
  children: ReactNode
  asChild?: boolean
}) => {
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  }
  const { resolvedTheme } = useTheme()
  const currTheme = (resolvedTheme || 'light') as keyof typeof themeMap

  const theme = themeMap[currTheme]

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent align='start' className='p-0 w-full border-none shadow-none'>
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default IconPicker
