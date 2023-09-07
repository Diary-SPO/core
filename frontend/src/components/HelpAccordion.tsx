import { Accordion, Div, Text } from '@vkontakte/vkui';
import { FC, ReactNode, useState } from 'react';

export interface IHelpAccordion {
  id: number
  title: string
  detail: ReactNode
}

const infoStyle = { color: 'var(--vkui--color_text_subhead)' };

const HelpAccordion: FC<IHelpAccordion> = ({ id, title, detail }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    // @ts-ignore
    <Accordion key={id} open={openId === id} onToggle={(e) => e.target.open && setOpenId(id)}>
      <Accordion.Summary>{title}</Accordion.Summary>
      <Div style={infoStyle}>
        <Text>
          {detail}
        </Text>
      </Div>
    </Accordion>
  );
};

export default HelpAccordion;
