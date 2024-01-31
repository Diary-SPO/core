import { GroupsModel, TeacherModel, sequelize } from '@db'
import { DataTypes } from 'sequelize'

export const ScheduleModel = sequelize.define(
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
            model: GroupsModel,
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
    classroomBuilding: {
        type: DataTypes.STRING(3),
        allowNull: true
    },
    classroomName: {
        type: DataTypes.STRING(7),
        allowNull: true
    },
    subjectName: {
        type: DataTypes.STRING(85),
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    startTime: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    endTime: {
        type: DataTypes.STRING(5),
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
