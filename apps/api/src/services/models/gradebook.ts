import { LessonTypeModel, ScheduleModel, sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'

export type GradebookModelType = {
  id: number
  scheduleId: number
  lessonTypeId: number
}

export type IGradebookModel = Model<GradebookModelType, Optional<GradebookModelType, 'id'>> & GradebookModelType

export const GradebookModel = sequelize.define<IGradebookModel>(
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
