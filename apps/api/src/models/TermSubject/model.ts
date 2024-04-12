import { DataTypes } from 'sequelize'

import { sequelize } from '@db'

import { DiaryUserModel } from '../DiaryUser'
import { ExaminationTypeModel } from '../Examination'
import { MarkValueModel } from '../MarkValue'
import { SubjectModel } from '../Subject'
import { TeacherModel } from '../Teacher'
import { TermModel } from '../Term'
import { TermSubjectExaminationTypeModel } from '../TermSubjectExaminationType'
import type { IModelPrototypeNoId } from '../types'

export type TermSubjectModelType = {
  termId: bigint
  subjectId: bigint
  diaryUserId: bigint
  markValueId?: number
  teacherId?: bigint
  examinationTypeId?: number
  termSubjectExaminationTypeId?: number
  idFromDiary?: number
}

export type ITermSubjectModel = IModelPrototypeNoId<TermSubjectModelType>

export const TermSubjectModel = sequelize.define<ITermSubjectModel>(
  'termSubject',
  {
    termId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: TermModel,
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: SubjectModel,
        key: 'id'
      }
    },
    diaryUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: DiaryUserModel,
        key: 'id'
      }
    },
    markValueId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: MarkValueModel,
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: TeacherModel,
        key: 'id'
      }
    },
    examinationTypeId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: ExaminationTypeModel,
        key: 'id'
      }
    },
    termSubjectExaminationTypeId: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: TermSubjectExaminationTypeModel
      }
    },
    idFromDiary: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }
)
