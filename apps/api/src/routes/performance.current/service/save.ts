import { sequelize } from '@db'
import { ICacheData } from '@helpers'
import { PerformanceCurrent } from '@diary-spo/shared'
import { Op } from 'sequelize'
import { 
  MarkValueModel, 
  MarkModel,
  ScheduleModel,
  TaskModel, 
  GradebookModel
} from '@models'
import { getLessonsService } from '../../lessons/lessonsService'

export const savePerformance = async (
  performance: PerformanceCurrent,
  userInfo: ICacheData
) => {
  const subjectMarks = performance.daysWithMarksForSubject
  const idsToSave: number[] = [] // id оценок, которые не удаляем

  for (const subject of subjectMarks) {
    const subjectName = subject.subjectName

    if (!subject.daysWithMarks) {
      continue
    }

    //console.log(subjectName)

    for (const day of subject.daysWithMarks) {
      const date = String(day.day).split('T')[0]

      const dbMarks = await sequelize.query(`
        select json_build_object(
          'day', s."date",
          'markValues', jsonb_agg(mv.value),
          'tasks', jsonb_agg(t.id)
        ) res
        from mark m 
        inner join "markValue" mv on mv.id = m."markValueId" 
        inner join task t on t.id = m."taskId"
        inner join gradebook g on g.id = t."gradebookId"
        inner join schedule s on s."gradebookId" = g.id
        inner join subject on subject.id = s."subjectId"
        where subject.name like '%${subjectName}%' and s."date" = '${date}'
        group by s."date"
        order by s."date"
      `)

      // Если в базе те же данные, то пропускаем
      if (
        dbMarks &&
        dbMarks.length > 0 &&
        dbMarks[0].length > 0 &&
        equils(dbMarks[0][0].res.markValues, day.markValues)
      ) {
        //console.log('skip', equils(dbMarks[0][0].res.markValues, day.markValues), dbMarks[0][0].res.markValues, day.markValues)
        idsToSave.push(...dbMarks[0][0].res.tasks)
        continue
      }

      // FIXME: почему в одном сервисе используется другой?
      const dateInfo = await getLessonsService(
        date,
        date,
        userInfo.idFromDiary,
        userInfo.cookie
      )

      if (typeof dateInfo === 'string' || dateInfo.length === 0) {
        continue
      }

      for (const dayDetailed of dateInfo) {
        if (!dayDetailed.lessons) {
          continue
        }

        for (const lesson of dayDetailed.lessons) {
          //console.log(JSON.stringify(lesson), dayDetailed.date, date, day.day)
          if (!lesson?.gradebook?.tasks) {
            continue
          }

          for (const task of lesson.gradebook?.tasks) {
            //console.log(task)
            // Ищем связанную таску по оригинальному id. Сверяем по groupId, т.к. нам нужно проверить связь по SPO
            const taskFromDB = await TaskModel.findOne({
              where: {
                idFromDiary: task.id
              },
              include: {
                model: GradebookModel,
                include: {
                  model: ScheduleModel,
                  where: {
                    groupId: userInfo.groupId
                  }
                }
              }
            })

            if (!taskFromDB) {
              continue
            }

            const [markValueFromDB] = await MarkValueModel.findOrCreate({
              where: {
                value: task.mark
              },
              defaults: {
                value: task.mark
              }
            })

            if (!markValueFromDB) {
              continue
            }
            //console.log(taskFromDB.toJSON())

            const markWhere = {
              diaryUserId: userInfo.localUserId,
              taskId: taskFromDB.id
            }

            const [mark, isCreated] = await MarkModel.findOrCreate({
              where: {
                ...markWhere
              },
              defaults: {
                ...markWhere,
                markValueId: markValueFromDB.id
              }
            })

            if (!isCreated && mark.markValueId !== markValueFromDB.id) {
              console.log(
                `[userId: ${userInfo.idFromDiary}] => Оценка по ${subjectName} изменена на ${task.mark}`
              )
              mark.update({
                markValueId: markValueFromDB.id
              })
            }

            if (isCreated) {
              console.log(
                `[userId: ${userInfo.idFromDiary}] => Новая оценка ${task.mark} по ${subjectName}`
              )
            }

            idsToSave.push(mark.toJSON().taskId)
          }
        }
      }
    }
  }

  if (idsToSave.length === 0) {
    return
  }

  MarkModel.destroy({
    where: {
      diaryUserId: userInfo.localUserId,
      taskId: {
        [Op.notIn]: idsToSave
      }
    }
  })
}

type IKeyCounter = { [key: string]: number }
const equils = (a: string[], b: string[]) => {
  const aKeys: IKeyCounter = {}
  const bKeys: IKeyCounter = {}
  let equil = true

  a.forEach((e) => {
    if (aKeys?.[e]) {
      aKeys[e]++
    } else {
      aKeys[e] = 1
    }
  })

  b.forEach((e) => {
    if (bKeys?.[e]) {
      bKeys[e]++
    } else {
      bKeys[e] = 1
    }
  })

  Object.keys(aKeys).forEach((k) => {
    if (aKeys[k] !== bKeys[k]) {
      equil = false
    }
  })

  return equil
}
