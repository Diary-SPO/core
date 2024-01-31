import { SPOModel } from './SPO'
import { AuthModel } from './auth'
import { DiaryUserModel } from './diaryUser'
import { GroupsModel } from './groups'

export * from './SPO'
export * from './groups'
export * from './diaryUser'
export * from './auth'

// Устанавливаем связи

// SPO <--->> Groups
SPOModel.hasMany(GroupsModel, {
  foreignKey: 'id'
})
GroupsModel.belongsTo(SPOModel, {
  foreignKey: 'spoId'
})

// Groups <--->> DaryUser
GroupsModel.hasMany(DiaryUserModel, {
  foreignKey: 'id'
})
DiaryUserModel.belongsTo(GroupsModel, {
  foreignKey: 'groupId'
})

// DiaryUser <--->> Auth
DiaryUserModel.hasMany(AuthModel, {
  foreignKey: 'id'
})
AuthModel.belongsTo(DiaryUserModel, {
  foreignKey: 'idDiaryUser'
})
