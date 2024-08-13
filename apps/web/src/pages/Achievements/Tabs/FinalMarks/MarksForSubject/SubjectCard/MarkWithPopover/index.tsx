import { Div, Popover, Subhead } from '@vkontakte/vkui'
import type { FC } from 'preact/compat'
import { ExplanationTooltip, Mark } from '../../../../../../../shared/ui'

import type { Term } from '../../types.ts'

import './index.css'

export const MarkWithPopover: FC<{ term: Term }> = ({ term }) => {
  const markComponent = (
    <Mark
      id='menubutton'
      aria-controls='menupopup'
      aria-haspopup='true'
      className='marksGap'
      size='s'
      mark={term.mark}
    />
  )

  const popoverContent = (
    <Div className='markPopoverContent'>
      {term.mark === '.' ? (
        <ExplanationTooltip
          tooltipContent='(отсутствует)'
          text={<>Оценка: {markComponent} </>}
        />
      ) : (
        //@ts-ignore типы React не совсем совместимы с Preact
        <Subhead>Оценка: {markComponent} </Subhead>
      )}
      {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
      <Subhead>
        Курс: {term.course}, семестр: {term.semester}
      </Subhead>
    </Div>
  )

  return (
    <Popover
      trigger='click'
      id='menupopup'
      role='menu'
      aria-labelledby='menubutton'
      content={popoverContent}
    >
      <div className='markPopoverContentWrapper'>{markComponent}</div>
    </Popover>
  )
}
