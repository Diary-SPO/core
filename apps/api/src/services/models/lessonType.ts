import { sequelize } from '@db'
import { DataTypes, Model, Optional } from 'sequelize'

export type LessonTypeModelType = {
  id: number
  name: string
}

export type ILessonTypeModel = Model<LessonTypeModelType, Optional<LessonTypeModelType, 'id'>> & LessonTypeModelType

export const LessonTypeModel = sequelize.define<ILessonTypeModel>(
  'lessonType',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
)
