import { Icon24Dismiss } from '@vkontakte/icons'
import {
  FormItem,
  FormLayoutGroup,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  PanelHeaderButton,
  PanelHeaderClose,
  Radio,
  RadioGroup,
  usePlatform
} from '@vkontakte/vkui'
import { type FC, useState } from 'react'

interface Props {
  filtersModalOpened: boolean
  MODAL_NAME: string
  closeModal: () => void
}

const avaTypes = {
  types: ['Не важно', 'Статичные', 'Анимированные'],
  pictured: ['Не важно', 'Парень', 'Девушка']
}

const filtersModal: FC<Props> = ({
  filtersModalOpened,
  MODAL_NAME,
  closeModal
}) => {
  const [selectedType, setSelectedType] = useState(avaTypes.types[0])
  const [selectedPictured, setSelectedPictured] = useState(avaTypes.types[0])

  const selectType = (value: string) => {
    setSelectedType(value)
  }

  const selectPictured = (value: string) => {
    setSelectedPictured(value)
  }

  const platform = usePlatform()
  return (
    <ModalRoot
      activeModal={filtersModalOpened ? MODAL_NAME : null}
      onClose={closeModal}
    >
      <ModalPage
        id={MODAL_NAME}
        header={
          <ModalPageHeader
            before={
              platform !== 'ios' && <PanelHeaderClose onClick={closeModal} />
            }
            after={
              platform === 'ios' && (
                <PanelHeaderButton onClick={closeModal}>
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
          >
            Фильтры
          </ModalPageHeader>
        }
      >
        <FormLayoutGroup>
          <FormItem top='Тип изображения' topComponent='h5'>
            <RadioGroup>
              {avaTypes.types.map((value) => {
                return (
                  <Radio
                    key={value}
                    value={value}
                    name='type'
                    checked={selectedType === value}
                    onChange={() => selectType(value)}
                  >
                    {value}
                  </Radio>
                )
              })}
            </RadioGroup>
          </FormItem>

          <FormItem top='Кто изображён' topComponent='h5'>
            <RadioGroup>
              {avaTypes.pictured.map((value) => {
                return (
                  <Radio
                    key={value}
                    value={value}
                    name='pictured'
                    checked={selectedPictured === value}
                    onChange={() => selectPictured(value)}
                  >
                    {value}
                  </Radio>
                )
              })}
            </RadioGroup>
          </FormItem>
        </FormLayoutGroup>
      </ModalPage>
    </ModalRoot>
  )
}

export default filtersModal
