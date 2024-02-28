import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { ClassroomModel } from '../Classroom'
import { GradebookModel } from '../Gradebook'
import { GroupModel } from '../Group'
import { SubjectModel } from '../Subject'
import { TeacherModel } from '../Teacher'
import { IModelPrototype } from '../types'

export type ScheduleModelType = {
  id: number
  groupId: number
  teacherId: number | null
  subjectId: number | null
  date: Date | string
  startTime: string
  endTime: string
  classroomId: number
  gradebookId?: number | null
}

export type IScheduleModel = IModelPrototype<ScheduleModelType, 'id'>

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
    date: {
      type: DataTypes.DATE,
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
    },
    gradebookId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: GradebookModel,
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