import { useEffect, useState } from 'preact/hooks'

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = () => {
    const currentPosition = window.scrollY
    setScrollPosition(currentPosition)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollPosition
}

export default useScrollPosition
