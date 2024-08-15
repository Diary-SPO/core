import { LessonWorkType } from '@diary-spo/shared'
import { useMarkModal } from '@store'
import {
  Group,
  InfoRow,
  ModalPage,
  ModalPageHeader,
  SimpleCell
} from '@vkontakte/vkui'
import { setDefaultMark } from '../../../../../../shared'
import { Mark } from '../../../../../../shared/ui'

const MarkDetailedModal = ({ id }: { id: string }) => {
  const { modalData } = useMarkModal()

  return (
    <ModalPage id={id} size={500} dynamicContentHeight>
      <ModalPageHeader>Подробнее об оценке</ModalPageHeader>
      <Group>
        <SimpleCell multiline>
          <InfoRow header='Предмет'>{modalData.lessonName}</InfoRow>
        </SimpleCell>
        <SimpleCell multiline>
          <InfoRow header='Тема'>{modalData.data.topic}</InfoRow>
        </SimpleCell>
        <SimpleCell
          multiline
          after={<Mark size='s' mark={setDefaultMark(modalData.data)} />}
        >
          <InfoRow header='Тип оценки'>
            {LessonWorkType[modalData.data.type] ??
              (modalData.data.isRequired && !modalData.data.mark && 'Долг') ??
              'Неизвестен'}
          </InfoRow>
        </SimpleCell>
      </Group>
    </ModalPage>
  )
}

export default MarkDetailedModal
