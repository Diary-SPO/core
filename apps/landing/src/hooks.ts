import { useEffect, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'landing-theme'

function getStoredTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const fromDom = document.documentElement.dataset.theme
    const initial =
      getStoredTheme() ??
      (fromDom === 'light' || fromDom === 'dark' ? fromDom : getSystemTheme())
    setTheme(initial)
    document.documentElement.dataset.theme = initial
    document.documentElement.style.colorScheme = initial
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      return
    }
  }, [theme, mounted])

  return [theme, setTheme]
}

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => {
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return ref
}

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}
