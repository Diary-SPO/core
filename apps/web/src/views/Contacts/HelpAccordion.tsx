import { Nullable } from '@types'
import { Accordion, Div, Text } from '@vkontakte/vkui'
import { FC, ReactNode } from 'preact/compat'
import { useState } from 'preact/hooks'

interface IHelpAccordion {
  id: number
  title: string
  detail: ReactNode
}

const infoStyle = { color: 'var(--vkui--color_text_subhead)' }

const HelpAccordion: FC<IHelpAccordion> = ({ id, title, detail }) => {
  const [openId, setOpenId] = useState<Nullable<number>>(null)

  return (
    <Accordion
      key={id}
      expanded={openId === id}
      onChange={(e) => (e ? setOpenId(id) : setOpenId(null))}
    >
      {/*//@ts-ignore типы React не совсем совместимы с Preact */}
      <Accordion.Summary>{title}</Accordion.Summary>
      {/*//@ts-ignore типы React не совсем совместимы с Preact */}
      <Accordion.Content>
        <Div style={infoStyle}>
          {/*//@ts-ignore типы React не совсем совместимы с Preact */}
          <Text>{detail}</Text>
        </Div>
      </Accordion.Content>
    </Accordion>
  )
}

export default HelpAccordion
