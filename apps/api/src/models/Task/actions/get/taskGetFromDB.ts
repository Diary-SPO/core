import { TaskModel } from '../../model'

export const taskGetFromDB = async (taskIdFromDiary: number) =>
  TaskModel.findOne({
    where: {
      idFromDiary: taskIdFromDiary
    }
  })
