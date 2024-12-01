import {
  FormItem,
  FormLayoutGroup,
  ModalPage,
  ModalPageHeader,
  Radio,
  RadioGroup
} from '@vkontakte/vkui'
import { type FC, useState } from 'react'

interface Props {
  id: string
}

const avaTypes = {
  types: ['Не важно', 'Статичные', 'Анимированные'],
  pictured: ['Не важно', 'Парень', 'Девушка']
}

const filtersModal: FC<Props> = ({ id }) => {
  const [selectedType, setSelectedType] = useState(avaTypes.types[0])
  const [selectedPictured, setSelectedPictured] = useState(avaTypes.types[0])

  const selectType = (value: string) => {
    setSelectedType(value)
  }

  const selectPictured = (value: string) => {
    setSelectedPictured(value)
  }

  return (
    <ModalPage id={id} header={<ModalPageHeader>Фильтры</ModalPageHeader>}>
      <FormLayoutGroup>
        <FormItem top='Тип изображения'>
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

        <FormItem top='Кто изображён'>
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
  )
}

export default filtersModal
