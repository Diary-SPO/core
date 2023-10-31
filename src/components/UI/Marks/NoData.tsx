import { Card, CardGrid, Div, Group, Header, Title } from '@vkontakte/vkui'

const NoData = (
  <Group
    mode="plain"
    header={<Header mode="secondary">Оценки по дисциплинам</Header>}
  >
    <CardGrid size="l">
      <Card mode="shadow">
        <Div>
          {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
          <Title level="3">Нет данных</Title>
        </Div>
      </Card>
    </CardGrid>
  </Group>
)

export default NoData
