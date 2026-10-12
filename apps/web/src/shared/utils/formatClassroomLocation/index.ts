import type { Classroom } from '@diary-spo/shared'

import { isDistant } from '../isDistant'

type ClassroomLocation = Pick<Classroom, 'buildingName' | 'name'>

export const formatClassroomLocation = (
  classroom?: ClassroomLocation
): string => {
  const buildingName = String(classroom?.buildingName ?? '').trim()
  const classroomName = classroom?.name?.trim()
  const formattedBuildingName = /^\d+$/.test(buildingName) // если только цифры, то добавляем "корп."
    ? `корп. ${buildingName}`
    : buildingName

  if (classroomName && isDistant(classroomName)) {
    return classroomName
  }

  if (formattedBuildingName && classroomName) {
    return `${formattedBuildingName}, каб. ${classroomName}`
  }

  if (classroomName) {
    return `каб. ${classroomName}`
  }

  return formattedBuildingName || 'Нет кабинета'
}
