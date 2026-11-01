import catPreview from '../../../../assets/images/app-icons/cat.png'
import defaultPreview from '../../../../assets/images/app-icons/default.png'
import playfulPreview from '../../../../assets/images/app-icons/playful.png'
import type { AppIconOption } from '../../../../shared/api/runtime/types.ts'

import './index.css'

const previewById: Record<string, string> = {
  default: defaultPreview,
  cat: catPreview,
  playful: playfulPreview
}

interface AppIconGridProps {
  options: AppIconOption[]
  value: string
  onChange: (iconId: string) => void
}

const AppIconGrid = ({ options, value, onChange }: AppIconGridProps) => (
  <div className='appIconGrid' role='listbox' aria-label='Иконка приложения'>
    {options.map((option) => {
      const selected = option.id === value
      const preview = previewById[option.id] ?? previewById.default
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
