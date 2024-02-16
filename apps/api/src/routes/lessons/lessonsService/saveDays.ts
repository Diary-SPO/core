import { Day } from "@diary-spo/shared";
import { saveLesson } from "./saveLesson";

export const saveDays = async (days: Day[], userId: number): Promise<void> => {
    days.forEach(async day => {
        const lessons = day.lessons
        if (!lessons) {
            console.log(`[${day.date}] Пустой список занятий`)
            return
        }

        lessons.forEach(lesson => {
            saveLesson(lesson, userId)
        })
    })
}