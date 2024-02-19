import { ApiError } from '@api'
import { Day, Lesson } from '@diary-spo/shared'
import {
  IScheduleModel,
  ITeacherModel,
  ScheduleModel,
  ScheduleModelType,
  TeacherModel,
  TeacherModelType
} from '../models'
import {
  IScheduleSubgroupModelType,
  ScheduleSubgroupModel,
  ScheduleSubgroupModelType
} from '../models/scheduleSubgroup'
import {
  ISubgroupModelType,
  SubgroupModel,
  SubgroupModelType
} from '../models/subgroup'
import {
  ISubjectModelType,
  SubjectModel,
  SubjectModelType
} from '../models/subject'
import { IUserInfo, diaryUserGetFromId } from './diaryUser'
import { LessonSave } from './lesson'
import { ClassroomModel, IClassroomModelType } from '../models/classroom'

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

type IAllLessonInfo = IScheduleModel & {
  scheduleSubgroups: IScheduleSubgroupModelType[] & {
    subgroup: ISubgroupModelType
  }
  subject: ISubjectModelType
  teacher: ITeacherModel
  classroom: IClassroomModelType
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
      if (dbLesson.scheduleSubgroups.length == 0) {
        locatedInSubgroups = true
      }
      if (
        ((lesson.name === dbLesson.subject.name ?? '') &&
          lesson.timetable.teacher?.id === dbLesson.teacher.idFromDiary &&
          lesson.startTime === dbLesson.startTime &&
          lesson.endTime === dbLesson.endTime &&
          lesson.timetable.classroom.name === dbLesson.classroom.name ||
        !locatedInSubgroups
      )){
        locatedInside = true
      }
    }
    if (!locatedInside) {
      console.log(`Удаляю устаревшее расписание! ${dbLesson.id}`)
      dbLesson.destroy()
    }
  }
}
