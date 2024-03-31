import { type ISubjectModelType, SubjectModel } from '@models'
import { LogError } from 'src/LogError'

export const subjectSaveOrGet = async (
  subjectName: string
): Promise<ISubjectModelType> =>
  SubjectModel.findOrCreate({
    where: {
      name: subjectName
    },
    defaults: {
      name: subjectName
    }
  }).then((v) => v[0])
