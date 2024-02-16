import { ITeacherModel, TeacherModel, TeacherModelType } from '@db'
import { Optional } from 'sequelize'

export const getOrSaveTeacher = async (
  teacherData: Optional<TeacherModelType, 'id'> | null
): Promise<ITeacherModel | null> => {
  if (!teacherData) {
    return null
  }

  const teacher = TeacherModel.findOrCreate({
    where: {
      id: teacherData.idFromDiary,
      spoId: teacherData.spoId
    },
    defaults: {
      ...teacherData
    }
  })

  // TODO: ДОРАБОТАТЬ СОХРАНЕНИЕ
}
