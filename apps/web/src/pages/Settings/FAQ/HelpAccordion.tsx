import type { Nullable } from '@diary-spo/shared'
import { Accordion, Div, Text } from '@vkontakte/vkui'
import { type FC, type ReactNode, useState } from 'react'

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
      <Accordion.Summary>{title}</Accordion.Summary>
      <Accordion.Content>
        <Div style={infoStyle}>
          <Text>{detail}</Text>
        </Div>
      </Accordion.Content>
    </Accordion>
  )
}

export default HelpAccordion
