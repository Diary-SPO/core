import { useLessonFocus } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useEffect } from 'react'

import { PAGE_SCHEDULE } from '../../../routes/constants'
import {
  consumeGradeNotificationOpen,
  GRADE_NOTIFICATION_OPEN_EVENT,
  GRADE_NOTIFICATION_OPEN_KEY,
  type GradeNotificationOpen
} from '../../../../shared/utils/gradeNotificationOpen'

const GradeNotificationGuardian = () => {
  const routeNavigator = useRouteNavigator()
  const { focusOn } = useLessonFocus()

  useEffect(() => {
    const open = (payload: GradeNotificationOpen) => {
      focusOn(payload.day, -1, {
        subjectName: payload.subjectName,
        openLessonModal: true
      })
      void routeNavigator.push(PAGE_SCHEDULE)
    }

    const pending = consumeGradeNotificationOpen()
    if (pending) open(pending)

    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent<GradeNotificationOpen>).detail
      if (!detail?.day || !detail.subjectName) return
      try {
        localStorage.removeItem(GRADE_NOTIFICATION_OPEN_KEY)
      } catch {
        // ignore
      }
      open(detail)
    }

    window.addEventListener(GRADE_NOTIFICATION_OPEN_EVENT, onEvent)
    return () => window.removeEventListener(GRADE_NOTIFICATION_OPEN_EVENT, onEvent)
  }, [focusOn, routeNavigator])

  return null
}

export default GradeNotificationGuardian
