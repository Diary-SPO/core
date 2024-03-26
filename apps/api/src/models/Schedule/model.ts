import { sequelize } from '@db'
import { Nullable } from '@diary-spo/shared'
import { DataTypes, Optional } from 'sequelize'
import { ClassroomModel } from '../Classroom'
import { GroupModel } from '../Group'
import { LessonTypeModel } from '../LessonType'
import { SubjectModel } from '../Subject'
import { TeacherModel } from '../Teacher'
import { IModelPrototype } from '../types'

export type ScheduleModelType = {
  id: number
  groupId: number
  teacherId: Nullable<number>
  subjectId: Nullable<number>
  lessonTypeId?: Nullable<number>
  gradebookIdFromDiary?: Nullable<number>
  date: Date | string
  startTime: string
  endTime: string
  classroomId: Nullable<number>
  gradebookId?: Nullable<number>
}

export type IScheduleModel = IModelPrototype<ScheduleModelType, 'id'>
export type IScheduleModelNoId = Optional<ScheduleModelType, 'id'>

export const ScheduleModel = sequelize.define<IScheduleModel>('schedule', {
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
    },
    unique: 'unique_schedule_k'
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
    },
    unique: 'unique_schedule_k'
  },
  lessonTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: LessonTypeModel,
      key: 'id'
    }
  },
  gradebookIdFromDiary: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'unique_schedule_k'
  },
  startTime: {
    type: DataTypes.STRING(5),
    allowNull: false,
    unique: 'unique_schedule_k'
  },
  endTime: {
    type: DataTypes.STRING(5),
    allowNull: false,
    unique: 'unique_schedule_k'
  },
  classroomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ClassroomModel,
      key: 'id'
    }
  }
})
