import React, { useEffect, useState } from 'react'

const useOrigin = () => {
  let [mounted, setMounted] = useState(false)
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ''

  useEffect(() => {
    setMounted(false)
  }, [])

  if (!mounted) {
    return ''
  }

  return origin
}

export default useOrigin
