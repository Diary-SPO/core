import type { AppIconOption } from '../../../../shared/api/runtime/types.ts'
import { appIconPreviews } from './previews'

import './index.css'

interface AppIconGridProps {
  options: AppIconOption[]
  value: string
  onChange: (iconId: string) => void
}

const AppIconGrid = ({ options, value, onChange }: AppIconGridProps) => (
  <div className='appIconGrid' role='listbox' aria-label='Иконка приложения'>
    {options.map((option) => {
      const selected = option.id === value
      const preview = appIconPreviews[option.id] ?? appIconPreviews.default
      return (
        <button
          key={option.id}
          type='button'
          role='option'
          aria-selected={selected}
          className={`appIconGrid__option${selected ? ' appIconGrid__option--selected' : ''}`}
          onClick={() => onChange(option.id)}
        >
          <span className='appIconGrid__preview'>
            <img
              className='appIconGrid__image'
              src={preview}
              alt={option.name}
              draggable={false}
            />
          </span>
          <span className='appIconGrid__label'>{option.name}</span>
        </button>
      )
    })}
  </div>
)

export default AppIconGrid
