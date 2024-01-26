import { handleResponse } from '@utils'
import { describe, expect, it, vitest } from 'vitest'
import { HTTP_STATUSES } from '../../../types'

/** handleResponse **/
describe('handleResponse', () => {
  it('should handle non-Response input', () => {
    const mockData = { message: 'Success' }
    const loadingCallback = vitest.fn()
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
    const limitExceededCallback = vitest.fn()
    const loadingCallback = vitest.fn()
    const result = handleResponse(
      new Response('', { status: HTTP_STATUSES.RATE_LIMIT }),
      undefined,
      limitExceededCallback,
      loadingCallback
    )
    expect(limitExceededCallback).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle unauthorized error', () => {
    const showSnackbarMock = vitest.fn()
    const loadingCallback = vitest.fn()
    const result = handleResponse(
      new Response('', { status: HTTP_STATUSES.UNAUTHORIZED }),
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
    const errorCallback = vitest.fn()
    const showSnackbarMock = vitest.fn()
    const loadingCallback = vitest.fn()
    const result = handleResponse(
      new Response('', { status: HTTP_STATUSES.UNAUTHORIZED }),
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
    const showSnackbarMock = vitest.fn()
    const loadingCallback = vitest.fn()
    const result = handleResponse(
      new Response('', { status: HTTP_STATUSES.TEAPOT }),
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
    const errorCallback = vitest.fn()
    const showSnackbarMock = vitest.fn()
    const loadingCallback = vitest.fn()
    const result = handleResponse(
      new Response('', { status: HTTP_STATUSES.TEAPOT }),
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
    const errorCallback = vitest.fn()
    const loadingCallback = vitest.fn()
    const result = handleResponse(
      new Response('', { status: HTTP_STATUSES.INTERNAL }),
      errorCallback,
      undefined,
      loadingCallback
    )
    expect(errorCallback).toHaveBeenCalled()
    expect(loadingCallback).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
