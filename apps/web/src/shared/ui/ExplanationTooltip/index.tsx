import { Icon16HelpOutline } from '@vkontakte/icons'
import { Popover, Subhead } from '@vkontakte/vkui'
import type { FC, ReactNode } from 'react'

interface ITooltipText {
  text?: ReactNode
  tooltipContent: string
}

import './index.css'

const ExplanationTooltip: FC<ITooltipText> = ({ text, tooltipContent }) => {
  const textTooltip = (
    <Subhead className='explanationTooltipText' Component='h5'>
      {tooltipContent}
    </Subhead>
  )

  return (
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
