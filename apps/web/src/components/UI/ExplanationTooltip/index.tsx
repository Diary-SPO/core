import { FC } from 'preact/compat'
import { Icon16HelpOutline } from '@vkontakte/icons'
import { Popover, Subhead } from '@vkontakte/vkui'

interface ITooltipText {
  text?: string
  tooltipContent: string
}

import './index.css'

const ExplanationTooltip: FC<ITooltipText> = ({ text, tooltipContent }) => {
  const textTooltip = (
    //@ts-ignore типы React не совсем совместимы с Preact
    <Subhead
      style={{ padding: '8px ', color: 'var(--vkui--color_text_primary)' }}
      Component='h5'
    >
      {tooltipContent}
    </Subhead>
  )

  return (
    //@ts-ignore типы React не совсем совместимы с Preact
    <div style={{ cursor: 'pointer' }}>
      {text}
      <Popover style={{ maxWidth: 220 }} action='hover' content={textTooltip}>
        <Icon16HelpOutline className='iconHelp' />
      </Popover>
    </div>
  )
}

export default ExplanationTooltip
