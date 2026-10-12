import { useDiaryRegion } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  Cell,
  Group,
  Header,
  Image,
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
  const { selectedUrl, selectRegion } = useDiaryRegion()
  const [query, setQuery] = useState<string>('')

  const regions = useMemo(() => getSortedDiaryRegions(), [])
  const visibleRegions = regions.filter((region) =>
    diaryRegionMatches(query, region)
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
            after={
              <Image
                size={28}
                src={region.emblem}
                alt={region.name}
                borderRadius='s'
                withTransparentBackground
                noBorder
              />
            }
            onClick={() => chooseRegion(region.url)}
            subtitle={getDiaryDomain(region.url)}
          >
            {region.name}
          </Cell>
        ))}
        {visibleRegions.length === 0 && (
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
