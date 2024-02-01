import { Mark } from '@components'
import { VKUI_VIOLET } from '@config'
import { AcademicRecord, Grade } from '@diary-spo/shared'
import { SimpleCell } from '@vkontakte/vkui'
import { FC } from 'preact/compat'

interface FinalMarksProps {
  data: AcademicRecord
}

const FinalMarks: FC<FinalMarksProps> = ({ data }) => {
  if (!data) {
    return
  }

  const renderFinalMarks = () => {
    return data.subjects.map((subject) => {
      console.log(Grade[subject.finalMark.value])
      return (
        // @ts-ignore
        <SimpleCell
          onClick={() => console.log()}
          key={subject.name}
          after={
            subject.finalMark.value ? (
              <Mark
                color={
                  Number.isNaN(Number(Grade[subject.finalMark.value]))
                    ? VKUI_VIOLET
                    : undefined
                }
                size='s'
                mark={Grade[subject.finalMark.value]}
              />
            ) : undefined
          }
        >
          {subject.name}
        </SimpleCell>
      )
    })
  }

  return <div>{renderFinalMarks()}</div>
}

export default FinalMarks
