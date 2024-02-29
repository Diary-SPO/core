import { Lesson } from '@diary-spo/shared'
import { useLessonModal } from '@store'
import { ModalPage, ModalPageHeader } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import LessonGrade from './LessonGrade'
import LessonMainInfo, { ILessonMainInfo } from './LessonMainInfo'
import LessonTimePlaceInfo, {
  ILessonTimePlaceInfo
} from './LessonTimePlaceInfo'
import { cleanData } from './data.ts'
import { setLessonDetails } from './helpers.ts'

interface ILessonModal {
  id: string
}

const LessonModal: FC<ILessonModal> = ({ id }) => {
  const { modal } = useLessonModal()
  const [lessonData, setLessonData] = useState<Lesson>(cleanData)
  const [lessonMainInfo, setLessonMainInfo] = useState<
    Partial<ILessonMainInfo>
  >({})
  const [lessonTimePlaceInfo, setLessonTimePlaceInfo] = useState<
    Partial<ILessonTimePlaceInfo>
  >({})

  useEffect(() => {
    if (modal) {
      const {
        lessonData: newLessonData,
        lessonMainInfo: newLessonMainInfo,
        lessonTimePlaceInfo: newLessonTimePlaceInfo
      } = setLessonDetails(modal)

      setLessonData(newLessonData)
      setLessonMainInfo(newLessonMainInfo)
      setLessonTimePlaceInfo(newLessonTimePlaceInfo)
    }
  }, [modal])

  return (
    <ModalPage id={id} size={500} dynamicContentHeight>
      <ModalPageHeader>Подробнее о паре</ModalPageHeader>
      <LessonMainInfo lessonMainInfo={lessonMainInfo} />
      <LessonTimePlaceInfo lessonTimePlaceInfo={lessonTimePlaceInfo} />
      <LessonGrade
        tasks={lessonData.gradebook.tasks}
        absenceType={lessonData.gradebook.absenceType}
      />
    </ModalPage>
  )
}

export default LessonModal
