import { Icon16HelpOutline } from '@vkontakte/icons'
import { Popover, Subhead } from '@vkontakte/vkui'
import { FC, ReactNode } from 'preact/compat'

interface ITooltipText {
  text?: ReactNode
  tooltipContent: string
}

import './index.css'

const ExplanationTooltip: FC<ITooltipText> = ({ text, tooltipContent }) => {
  const textTooltip = (
    //@ts-ignore типы React не совсем совместимы с Preact
    <Subhead className='explanationTooltipText' Component='h5'>
      {tooltipContent}
    </Subhead>
  )

  return (
    //@ts-ignore типы React не совсем совместимы с Preact
    <div className='explanationTooltipWrapper'>
      {text}
      <Popover
        trigger={['click', 'hover']}
        className='explanationTooltipPopover'
        content={textTooltip}
      >
        <Icon16HelpOutline className='iconHelp' />
      </Popover>
    </div>
  )
}

export default ExplanationTooltip
