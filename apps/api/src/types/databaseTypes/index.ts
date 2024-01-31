import { Teacher } from '@diary-spo/shared'

export interface DBTeacher extends Teacher {
  spoId?: number
}

export interface DBSchedule {
  id?: number
  groupId: number
  teacherId: number
  classroomBuilding: string
  classroomName: string
  subjectName: string
  date: string
  startTime: string
  endTime: string
}
