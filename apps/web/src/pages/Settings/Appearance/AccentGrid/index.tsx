import { getSystemAccent } from '@runtime-api'
import { type CSSProperties, useEffect, useState } from 'react'
import {
  type AccentId,
  type AccentOption,
  readSystemAccentBase
} from '../../../../shared/config'

import './index.css'

interface AccentGridProps {
  options: AccentOption[]
  value: AccentId
  onChange: (accent: AccentId) => void
}

const AccentGrid = ({ options, value, onChange }: AccentGridProps) => {
  const [systemSwatch, setSystemSwatch] = useState(readSystemAccentBase)

  useEffect(() => {
    let cancelled = false
    void getSystemAccent().then((colors) => {
      if (!cancelled && colors?.base) setSystemSwatch(colors.base)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className='accentGrid' role='listbox' aria-label='Акцентный цвет'>
      {options.map((option) => {
        const selected = option.id === value
        const swatch = option.id === 'system' ? systemSwatch : option.base
        return (
          <button
            key={option.id}
            type='button'
            role='option'
            aria-selected={selected}
            aria-label={option.label}
            title={option.label}
            className={`accentGrid__option${selected ? ' accentGrid__option--selected' : ''}${option.id === 'system' ? ' accentGrid__option--system' : ''}`}
            style={{ '--accent-swatch': swatch } as CSSProperties}
            onClick={() => onChange(option.id)}
          >
            <span className='accentGrid__swatch' />
            <span className='accentGrid__label'>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default AccentGrid
