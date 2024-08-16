import { describe, expect, it, jest } from 'bun:test'

import { HTTP_STATUSES } from '../../../types.ts'
import { handleResponse } from '../index.tsx'

describe('handleResponse', () => {
  it('should handle non-Response input', () => {
    const mockData = { message: 'Success' }
    const loadingCallback = jest.fn()
    const result = handleResponse(
      mockData,
      undefined,
      undefined,
      loadingCallback
    )
    expect(result).toEqual(mockData)
    expect(loadingCallback).toHaveBeenCalled()
  })

  it('should handle rate limit error', () => {
    const limitExceededCallback = jest.fn()
    const loadingCallback = jest.fn()
    const result = handleResponse(
      { status: HTTP_STATUSES.RATE_LIMIT, error: 'error' },
      undefined,
      limitExceededCallback,
      loadingCallback
    )
    expect(limitExceededCallback).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle unauthorized error', () => {
    const showSnackbarMock = jest.fn()
    const loadingCallback = jest.fn()
    const result = handleResponse(
      { status: HTTP_STATUSES.UNAUTHORIZED, error: 'error' },
      undefined,
      undefined,
      loadingCallback,
      showSnackbarMock
    )

    expect(showSnackbarMock).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle unauthorized error with error cb', () => {
    const errorCallback = jest.fn()
    const showSnackbarMock = jest.fn()
    const loadingCallback = jest.fn()
    const result = handleResponse(
      { status: HTTP_STATUSES.UNAUTHORIZED, error: 'error' },
      errorCallback,
      undefined,
      loadingCallback,
      showSnackbarMock,
      undefined,
      true
    )

    expect(errorCallback).toHaveBeenCalled()
    expect(showSnackbarMock).not.toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle teapot error', () => {
    const showSnackbarMock = jest.fn()
    const loadingCallback = jest.fn()
    const result = handleResponse(
      { status: HTTP_STATUSES.TEAPOT, error: 'error' },
      undefined,
      undefined,
      loadingCallback,
      showSnackbarMock,
      false
    )
    expect(showSnackbarMock).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle teapot error with error cb', () => {
    const errorCallback = jest.fn()
    const showSnackbarMock = jest.fn()
    const loadingCallback = jest.fn()
    const result = handleResponse(
      { status: HTTP_STATUSES.TEAPOT, error: 'error' },
      errorCallback,
      undefined,
      loadingCallback,
      showSnackbarMock
    )
    expect(errorCallback).toHaveBeenCalled()
    expect(showSnackbarMock).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle default case', () => {
    const errorCallback = jest.fn()
    const loadingCallback = jest.fn()
    const result = handleResponse(
      { status: HTTP_STATUSES.INTERNAL, error: 'error' },
      errorCallback,
      undefined,
      loadingCallback
    )
    expect(errorCallback).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
