import { Icon16HelpOutline } from '@vkontakte/icons'
import { Popover, Subhead } from '@vkontakte/vkui'
import { CSSProperties, FC } from 'preact/compat'

interface ITooltipText {
  text?: string
  tooltipContent: string
}

const style: CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
  position: 'relative',
  top: -1,
  color: 'var(--vkui--color_icon_secondary)',
  marginLeft: 5
}

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
        <Icon16HelpOutline style={style} />
      </Popover>
    </div>
  )
}

export default ExplanationTooltip
