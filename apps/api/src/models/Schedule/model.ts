import { sequelize } from '@db'
import { DataTypes, Optional } from 'sequelize'
import { AbsenceTypeModel } from '../AbsenceType'
import { ClassroomModel } from '../Classroom'
import { GroupModel } from '../Group'
import { SubjectModel } from '../Subject'
import { TeacherModel } from '../Teacher'
import { IModelPrototype } from '../types'
import { LessonTypeModel } from '../LessonType'

export type ScheduleModelType = {
  id: number
  groupId: number
  teacherId: number | null
  subjectId: number | null
  lessonTypeId?: number | null
  absenceTypeId?: number | null
  gradebookIdFromDiary?: number | null
  date: Date | string
  startTime: string
  endTime: string
  classroomId: number | null
  gradebookId?: number | null
}

export type IScheduleModel = IModelPrototype<ScheduleModelType, 'id'>
export type IScheduleModelNoId = Optional<ScheduleModelType, 'id'>

export const ScheduleModel = sequelize.define<IScheduleModel>(
  'schedule',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GroupModel,
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TeacherModel,
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SubjectModel,
        key: 'id'
      }
    },
    lessonTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: LessonTypeModel,
        key: 'id'
      }
    },
    absenceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AbsenceTypeModel,
        key: 'id'
      }
    },
    gradebookIdFromDiary: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    endTime: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    classroomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ClassroomModel,
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
