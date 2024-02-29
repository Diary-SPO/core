import { sequelize } from '@db'
import { DataTypes } from 'sequelize'
import { DiaryUserModel } from '../DiaryUser'
import { ExaminationTypeModel } from '../Examination'
import { MarkValueModel } from '../MarkValue'
import { SubjectModel } from '../Subject'
import { TeacherModel } from '../Teacher'
import { TermModel } from '../Term'
import { IModelPrototypeNoId } from '../types'

export type TermSubjectModelType = {
  termId: number
  subjectId: number
  diaryUserId: number
  markValueId?: number
  teacherId?: number
  examinationTypeId?: number
}

export type ITermSubjectModel = IModelPrototypeNoId<TermSubjectModelType>

export const TermSubjectModel = sequelize.define<ITermSubjectModel>(
  'termSubject',
  {
    termId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: TermModel,
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: SubjectModel,
        key: 'id'
      }
    },
    diaryUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: DiaryUserModel,
        key: 'id'
      }
    },
    markValueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MarkValueModel,
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
    examinationTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ExaminationTypeModel,
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
