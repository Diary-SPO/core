import { ICacheData } from '@helpers'
import { IScheduleModel } from '../model'

export const deleteOld = async (
  schedules: (IScheduleModel | null)[],
  authModel: ICacheData
) => {
  // TODO: удалять расписания
  // Если расписания нет в списке id'шников в schedules
  // и у расписания не тсвязанной подгруппы или подгруппа
  // принадлежит текущему пользователю, то удаляем
  //console.log(JSON.stringify(schedules, null, 2))
}
