import { LessonTypeModel, ScheduleModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const GradebookModel = sequelize.define(
  'gradebook',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ScheduleModel,
            key: 'id'
        }
    },
    lessonTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: LessonTypeModel,
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
