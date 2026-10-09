import { useDiaryRegion } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  Cell,
  Div,
  Footnote,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  Placeholder,
  Radio,
  Search
} from '@vkontakte/vkui'
import { type ChangeEvent, type FC, useMemo, useState } from 'react'

import {
  diaryRegionMatches,
  getDiaryDomain,
  getSortedDiaryRegions
} from '../../../../../../shared/config'

interface IRegionModal {
  id: string
}

const RegionModal: FC<IRegionModal> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const { selectedUrl, suggestedUrl, selectRegion } = useDiaryRegion()
  const [query, setQuery] = useState<string>('')

  const regions = useMemo(() => getSortedDiaryRegions(), [])
  const suggestedRegion =
    regions.find((region) => region.url === suggestedUrl) ?? null
  const showsSuggested =
    suggestedRegion !== null && diaryRegionMatches(query, suggestedRegion)
  const visibleRegions = regions.filter(
    (region) =>
      diaryRegionMatches(query, region) && region.url !== suggestedRegion?.url
  )

  const chooseRegion = (url: string) => {
    selectRegion(url)
    routeNavigator.hideModal()
  }

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value)
  }

  return (
    <ModalPage id={id} size={500} settlingHeight={75} noFocusToDialog>
      <ModalPageHeader>Регион дневника</ModalPageHeader>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'var(--vkui--color_background_modal)'
        }}
      >
        <Search
          value={query}
          onChange={onQueryChange}
          placeholder='Город или регион'
        />
      </div>
      {showsSuggested && suggestedRegion && (
        <Group header={<Header>Ваш регион</Header>}>
          <Cell
            before={
              <Radio
                name='diary-region'
                checked={selectedUrl === suggestedRegion.url}
                onChange={() => chooseRegion(suggestedRegion.url)}
                onClick={(event) => event.stopPropagation()}
              />
            }
            onClick={() => chooseRegion(suggestedRegion.url)}
            subtitle={getDiaryDomain(suggestedRegion.url)}
          >
            {suggestedRegion.name}
          </Cell>
          <Div>
            <Footnote>
              Определили по IP-адресу — проверьте, что регион ваш
            </Footnote>
          </Div>
        </Group>
      )}
      <Group header={<Header>Все регионы</Header>}>
        {visibleRegions.map((region) => (
          <Cell
            key={region.url}
            before={
              <Radio
                name='diary-region'
                checked={selectedUrl === region.url}
                onChange={() => chooseRegion(region.url)}
                onClick={(event) => event.stopPropagation()}
              />
            }
            onClick={() => chooseRegion(region.url)}
            subtitle={getDiaryDomain(region.url)}
          >
            {region.name}
          </Cell>
        ))}
        {visibleRegions.length === 0 && !showsSuggested && (
          <Placeholder
            title='Регион не найден'
            action={
              <Button
                Component='a'
                href='https://vk.me/diary_spo'
                target='_blank'
                rel='noreferrer'
                size='m'
              >
                Попросить добавить регион
              </Button>
            }
          >
            Попробуйте другое название или попросите добавить регион
          </Placeholder>
        )}
      </Group>
    </ModalPage>
  )
}

export default RegionModal
