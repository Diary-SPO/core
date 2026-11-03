import type { CSSProperties } from 'react'
import type { AccentId, AccentOption } from '../../../../shared/config'

import './index.css'

interface AccentGridProps {
  options: AccentOption[]
  value: AccentId
  onChange: (accent: AccentId) => void
}

const AccentGrid = ({ options, value, onChange }: AccentGridProps) => (
  <div className='accentGrid' role='listbox' aria-label='Акцентный цвет'>
    {options.map((option) => {
      const selected = option.id === value
      return (
        <button
          key={option.id}
          type='button'
          role='option'
          aria-selected={selected}
          aria-label={option.label}
          title={option.label}
          className={`accentGrid__option${selected ? ' accentGrid__option--selected' : ''}`}
          style={{ '--accent-swatch': option.base } as CSSProperties}
          onClick={() => onChange(option.id)}
        >
          <span className='accentGrid__swatch' />
          <span className='accentGrid__label'>{option.label}</span>
        </button>
      )
    })}
  </div>
)

export default AccentGrid
