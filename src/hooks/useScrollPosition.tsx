import { useEffect, useState } from 'preact/hooks'

/**
 * Функция 'useScrollPosition' отслеживает позицию скролла на странице.
 * Использует состояние 'scrollPosition', которое хранит текущую позицию скролла.
 * При скролле окна браузера вызывает обработчик 'handleScroll', который обновляет 'scrollPosition'
 * с текущей позицией скролла (полученной из window.scrollY).
 * Использует useEffect для добавления и удаления обработчика события скролла при монтировании и размонтировании компонента.
 * Возвращает текущую позицию скролла.
 */

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
