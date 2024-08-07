export const API_CODES = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  UNKNOWN_ERROR: 520
} as const

export const API_ERRORS = {
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  USER_NOT_PERMISSION: 'USER_NOT_PERMISSION',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
}
