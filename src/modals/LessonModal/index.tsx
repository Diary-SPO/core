import { Lesson } from '@diary-spo/shared'
import { setLessonDetails } from '@utils'
import { ModalPage, ModalPageHeader } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import useModal from '../../store/useModal'
import { cleanData } from '../data'
import LessonGrade from './LessonGrade'
import LessonMainInfo, { ILessonMainInfo } from './LessonMainInfo'
import LessonTimePlaceInfo, {
  ILessonTimePlaceInfo
} from './LessonTimePlaceInfo'

interface ILessonModal {
  id: string
}

const LessonModal: FC<ILessonModal> = ({ id }) => {
  const { modal } = useModal()
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

      console.log(newLessonData)

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
