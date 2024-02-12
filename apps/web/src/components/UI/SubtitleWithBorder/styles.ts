import { GREEN, ORANGE, RED } from '@config'

export const colors = {
  red: {
    background: RED,
    border: `1px solid ${RED}`,
    color: 'white'
  },
  green: {
    background: GREEN,
    border: `1px solid ${GREEN}`,
    color: 'white'
  },
  'green-outline': {
    color: 'green',
    borderRadius: '5px',
    border: `1px solid ${GREEN}`
  },
  'yellow-outline': {
    borderRadius: '5px',
    border: `1px solid ${ORANGE}`,
    color: '#ffb060'
  },
  'red-outline': {
    borderRadius: '5px',
    border: `1px solid ${RED}`,
    color: '#DA0A35'
  },
  yellow: {
    background: ORANGE,
    borderRadius: '5px',
    border: `1px solid ${ORANGE}`,
    color: 'white'
  }
}

export const defaultColor = {
  background: 'transparent',
  border: '1px solid var(--vkui--color_background_accent_themed)',
  color: 'var(--vkui--color_background_accent_themed)'
}
