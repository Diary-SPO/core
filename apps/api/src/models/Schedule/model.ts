import { sequelize } from '@db'
import type { Nullable } from '@diary-spo/shared'
import { DataTypes, type Optional } from 'sequelize'

import { ClassroomModel } from '../Classroom'
import { GroupModel } from '../Group'
import { LessonTypeModel } from '../LessonType'
import { SubjectModel } from '../Subject'
import { TeacherModel } from '../Teacher'
import type { IModelPrototype } from '../types'

export type ScheduleModelType = {
  id: bigint
  groupId: bigint
  teacherId: Nullable<bigint>
  subjectId: Nullable<bigint>
  lessonTypeId?: Nullable<number>
  gradebookIdFromDiary?: Nullable<number>
  date: Date | string
  startTime: string
  endTime: string
  classroomId: Nullable<bigint>
  gradebookId?: Nullable<number>
}

export type IScheduleModel = IModelPrototype<ScheduleModelType, 'id'>
export type IScheduleModelNoId = Optional<ScheduleModelType, 'id'>

export const ScheduleModel = sequelize.define<IScheduleModel>('schedule', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: GroupModel,
      key: 'id'
    },
    unique: 'unique_schedule_k'
  },
  teacherId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: TeacherModel,
      key: 'id'
    }
  },
  subjectId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: SubjectModel,
      key: 'id'
    },
    unique: 'unique_schedule_k'
  },
  lessonTypeId: {
    type: DataTypes.SMALLINT,
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
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: ClassroomModel,
      key: 'id'
    }
  }
})
