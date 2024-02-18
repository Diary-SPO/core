import { Day, Lesson } from "@diary-spo/shared";
import { diaryUserGetFromId } from "./diaryUser";
import { ApiError } from "@api";
import { LessonSave } from "./lesson";
import { IScheduleModel, ScheduleModel, TeacherModel } from "../models";
import { ScheduleSubgroupModel } from "../models/scheduleSubgroup";
import { SubgroupModel } from "../models/subgroup";
import { SubjectModel } from "../models/subject";
import { where } from "sequelize";

export const ScheduleSave = async (day: Day, userId: number) => {
  const lessons = day.lessons ?? []
  const user = await diaryUserGetFromId(userId, true)

  if (!user) {
    throw new ApiError("User not found", 403)
  }
  
  const dbLessons = await ScheduleModel.findAll({
    where: {
      date: day.date,
      groupId: user.groupId
    },
    include:[
      {
        model: ScheduleSubgroupModel, // scheduleSubgroups
        include: {
          model: SubgroupModel
        },
        where: {
          diaryUserId: user.id
        }
      },
      {
        model: SubjectModel
      },
      {
        model: TeacherModel
      }
    ],
  })

  // Удаляем устаревшее расписание
  for (const dbLesson of dbLessons) {
    let locatedInside = false
    for (const lesson of lessons) {
      let locatedInSubgroups = false
      for (const subgroup of dbLesson.scheduleSubgroups) {
        if (subgroup.diaryUserId === user.id) {
          locatedInSubgroups = true
        }
      }
      if (!dbLesson.scheduleSubgroups) {
        locatedInSubgroups = false
      }
      if ((lesson.name == dbLesson.subject.name ?? "")
          && lesson.timetable.teacher?.id == dbLesson.teacher.idFromDiary
          && lesson.startTime == dbLesson.startTime
          && lesson.endTime == dbLesson.endTime
          || !locatedInSubgroups
      ) {
        locatedInside = true
      }
    }
    if (!locatedInside) {
      console.log("Удаляю устаревшее расписание! " + dbLesson.id)
      dbLesson.destroy()
    }
  }

  for (const lesson of lessons) {
    await LessonSave(lesson, user, day.date).catch(
      (err) => console.log("[Ошибка сохранения занятия]", new Date().toISOString(), "=>", err.message)
    )
  }
}