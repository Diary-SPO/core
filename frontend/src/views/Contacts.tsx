import {FC, useState} from 'react';
import {
  Accordion, Div,  Group, Panel, Text, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';

const infoStyle = { color: 'var(--vkui--color_text_subhead)' };
const data = [
  {
    id: 1,
    title: 'Часто приходится удалять сервис',
    detail:
      'Как правило, эта проблема появляется на телефонах. Одно из возможных ёё решений - не заходить по прямой ссылке в сервис, а через страницу Сервисы -> Для вас -> Дневник СПО.',
  },
  {
    id: 2,
    title: 'В сервисе стоит оценка, которой нет в журнале Сетевого города',
    detail:
      `Мы тщательно обрабатываем вашу успеваемость и стараемся вывести корректную информацию, но иногда в журнале может появиться отметка, которой нет в оригинальном дневнике (Сетевой город). Обычно это 'Д' (Долг), но если вы уверены, что долго у вас нет, то напишите нам`,
  },
];

const Contacts: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();
  
  const AccordionVKID = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    
    return data.map(({ id, title, detail }) => (
      <Accordion key={id} open={openId === id} onToggle={(e) => e.target.open && setOpenId(id)}>
        <Accordion.Summary>{title}</Accordion.Summary>
        <Div style={infoStyle}>
          {detail.split('. ').map((sentence, index) => (
            <Text key={index}>{sentence}.</Text>
          ))}
        </Div>
      </Accordion>
    ));
  };
  
  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Помощь' />
        <Group>
          <AccordionVKID />
        </Group>
      </Panel>
    </View>
  );
};

export default Contacts;
