import { ApiError } from '@api'
import { Day, Lesson } from '@diary-spo/shared'
import {
  GradebookModel,
  GradebookModelType,
  IScheduleModel,
  ITeacherModel,
  LessonTypeModel,
  LessonTypeModelType,
  RequiredModel,
  RequiredModelType,
  ScheduleModel,
  TaskModel,
  TaskTypeModelType,
  TeacherModel,
  ThemeModel,
  ThemeModelType
} from '../models'
import { AbsenceTypeModel, AbsenceTypeModelType } from '../models/absenceType'
import { ClassroomModel, IClassroomModelType } from '../models/classroom'
import {
  IScheduleSubgroupModelType,
  ScheduleSubgroupModel
} from '../models/scheduleSubgroup'
import {
  ISubgroupModelType,
  SubgroupModel
} from '../models/subgroup'
import {
  ISubjectModelType,
  SubjectModel
} from '../models/subject'
import { IUserInfo, diaryUserGetFromId } from './diaryUser'
import { GradebookSaveOrGet } from './gradebook'
import { LessonSave } from './lesson'
import { sequelize } from '../initDBConnection'

export const ScheduleSave = async (day: Day, userId: number) => {
  const lessons = day.lessons ?? []
  const user = await diaryUserGetFromId(userId, true)

  if (!user) {
    throw new ApiError('User not found', 403)
  }

  // Удаляем устаревшее расписание
  deleteOldLessons(lessons, day.date, user)

  for (const lesson of lessons) {
    await LessonSave(lesson, user, day.date).catch((err) =>
      console.log(
        '[Ошибка сохранения занятия]',
        new Date().toISOString(),
        '=>',
        err.message
      )
    )
  }
}

export type IAllLessonInfo = IScheduleModel & {
  scheduleSubgroups: IScheduleSubgroupModelType[] & {
    subgroup: ISubgroupModelType
  }
  subject: ISubjectModelType
  teacher: ITeacherModel
  classroom: IClassroomModelType
  gradebook: GradebookModelType & {
    themes: ThemeModelType[]
    lessonType: LessonTypeModelType
    absenceType: AbsenceTypeModelType
    tasks: TaskTypeModelType[] & {
      taskType: TaskTypeModelType
      requireds: RequiredModelType[]
    }
  }
}

const deleteOldLessons = async (
  lessons: Lesson[],
  date: Date,
  user: IUserInfo
) => {
  const dbLessons = (await ScheduleModel.findAll({
    where: {
      date: date,
      groupId: user.groupId
    },
    include: [
      {
        model: ScheduleSubgroupModel, // scheduleSubgroups
        include: {
          // @ts-ignore
          model: SubgroupModel
        }
      },
      {
        model: SubjectModel
      },
      {
        model: TeacherModel
      },
      {
        model: ClassroomModel
      },
      {
        model: GradebookModel,
        include: [
          {
            model: ThemeModel
          },
          {
            model: LessonTypeModel
          },
          {
            model: AbsenceTypeModel
          },
          {
            model: TaskModel,
            include: [
              {
                model: RequiredModel
              }
            ]
          }
        ]
      }
    ]
  })) as IAllLessonInfo[]

  for (const dbLesson of dbLessons) {
    let locatedInside = false
    for (const lesson of lessons) {
      let locatedInSubgroups = false
      for (const subgroup of dbLesson.scheduleSubgroups) {
        if (subgroup.diaryUserId === user.id) {
          locatedInSubgroups = true
        }
      }
      if (dbLesson.scheduleSubgroups.length === 0) {
        locatedInSubgroups = true
      }
      if (
        ((lesson.name === dbLesson.subject.name ?? '') &&
          lesson.timetable.teacher?.id === dbLesson.teacher.idFromDiary &&
          lesson.startTime === dbLesson.startTime &&
          lesson.endTime === dbLesson.endTime &&
          lesson.timetable.classroom.name === dbLesson.classroom.name) ||
        !locatedInSubgroups
      ) {
        locatedInside = true
        // Обновляем на актуальную информацию
        if (lesson.gradebook) {
          GradebookSaveOrGet(lesson.gradebook, user).catch((err) =>
            console.log(
              `[${new Date().toISOString()}] => ошибка сохранения градебука: ${err}`
            )
          )
        }
      }
    }
    if (!locatedInside) {
      console.log(`Удаляю устаревшее расписание! ${dbLesson.id}`)
      if (dbLesson.gradebookId) {
        GradebookModel.destroy({
          where: {
            id: dbLesson.gradebookId
          }
        })
      }
      dbLesson.destroy()
    }
  }
}

export const ScheduleGetFromDB = async (
  startDate: string,
  endDate: string,
  userId: number
) => {
  const user = await diaryUserGetFromId(userId, true)

  if (!user) {
    return null
  }

  const formatSchedules = await sequelize.query(
    /*sql*/ `SELECT 
	json_build_object(
    'date', s."date" ,
    'lessons', json_agg(
      json_build_object(
        'startTime', s."startTime",
        'endTime', s."endTime",
        'gradebook', 
          case
            when g."idFromDiary" is null then null
            else jsonb_build_object(
              'id', g."idFromDiary",
              'lessonType', lt.name,
              'tasks', 
              case
                when t.id is null then json_build_array()
                else json_build_array(
                  json_build_object(
                    'topic', t.topic,
                    'id', t."idFromDiary",
                    'isRequired', r."isRequired",
                    'mark', '',
                    'type', tt."name" 
                )
              )
            end
            )
          end,
        'name', sj."name",
        'timetable',
          case
            when s."classroomId" is null and s."teacherId" is null then null
            else json_build_object(
              'teacher',
                case 
                  when s."teacherId" is null then null
                  else json_build_object(
                    'id', tr."idFromDiary",
                    'firstName', tr."firstName",
                    'lastName', tr."lastName",
                    'middleName', tr."middleName" 
                  ) 
                end,
              'classroom',
                case 
                  when s."classroomId" is null then null
                  else json_build_object(
                    'id', c."idFromDiary",
                    'building', c.building,
                    'name', c.name
                  ) 
                end
            )
          end
      )
    )
) as "data"
from schedule s
left join "scheduleSubgroup" ss on ss."scheduleId" = s.id
left join gradebook g on g.id = s."gradebookId"
left join "lessonType" lt on g."lessonTypeId"  = lt.id
left join subject sj on s."subjectId" = sj.id
left join task t on t."gradebookId" = g.id
left join "taskType" tt on tt.id = t."taskTypeId"
left join classroom c on s."classroomId" = c.id
left join teacher tr on s."teacherId" = tr.id
left join required r on r."taskId" = t.id
where ss."scheduleId" is null or ss."diaryUserId" = ${user.id}
group by "date"
having "date" between '${startDate}' and '${endDate}'
order by "date"
    `,
    {
      raw: true
    }
  )

  const days =
    (formatSchedules?.[0] as { data: any }[]).map(
      (schedule) => schedule.data
    ) ?? []
  const formatDays = []

  for (
    const day = new Date(startDate);
    day <= new Date(endDate);
    day.setDate(day.getDate() + 1)
  ) {
    let isSearch = false
    for (const dayDB of days) {
      if (dayDB.date === day.toISOString().split('T')[0]) {
        // Сортируем по дате начала пары
        dayDB.lessons.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
        formatDays.push(dayDB)
        isSearch = true
        break
      }
    }
    if (!isSearch) {
      formatDays.push({
        date: day.toISOString().split('T')[0],
        lessons: []
      })
    }
  }

  return formatDays
}
