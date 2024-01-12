import { Icon24ChevronRightCircle } from '@vkontakte/icons'
import { IconButton } from '@vkontakte/vkui'
import { FC } from 'react'

const ScrollToTop: FC = () => (
  <IconButton
    aria-label='scroll top'
    style={{ position: 'fixed', left: 5, bottom: 60 }}
    onClick={() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }}
  >
    <Icon24ChevronRightCircle
      style={{
        transform: 'rotate(-90deg)',
        color: 'var(--vkui--color_background_accent_themed)'
      }}
    />
  </IconButton>
)

export default ScrollToTop
