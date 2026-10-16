export { withSpinner } from './hocs'
export * from './ui'
export { formatClassroomLocation } from './utils/formatClassroomLocation'
export { handleResponse } from './utils/handleResponse'
export { isApiError } from './utils/isApiError'
export { isDistant } from './utils/isDistant'
export { isNeedToUpdateCache } from './utils/isNeedToUpdateCache'
export { dayAnchorId, lessonAnchorId, toISODate } from './utils/lessonAnchors'
export { logOut } from './utils/logOut'
export { createSubjectMarksMatrix } from './utils/marks/createSubjectMarksMap.ts'
export { setDefaultMark } from './utils/marks/setDefaultMark.ts'
export {
  clearAuthData,
  DIARY_REQUEST_FAILED_EVENT,
  emitRequestFailed,
  hasAuthData
} from './utils/session'
export { textToLink } from './utils/textToLink'
export { truncateString } from './utils/truncateString'
export { unreachable } from './utils/unreachable'
