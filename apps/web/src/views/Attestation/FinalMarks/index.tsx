import { FC } from 'preact/compat'

interface FinalMarksProps {
  data: any
}

const FinalMarks: FC<FinalMarksProps> = ({ data }) => {
  if (!data) {
    return
  }
  const renderFinalMarks = () => {
    return data.subjects.map((subject) => (
      <div key={subject.name}>
        <h4>{subject.name}</h4>
        {subject.finalMark && subject.finalMark.value && (
          <p>Final Mark: {subject.finalMark.value}</p>
        )}
      </div>
    ))
  }

  return (
    <div>
      <h2>Final Marks</h2>
      {renderFinalMarks()}
    </div>
  )
}

export default FinalMarks
