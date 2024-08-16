import { describe, expect, it } from 'bun:test'

import { isApiError } from '../index.ts'

describe('isApiError', () => {
  it('should return false when input is not a treaty error response', () => {
    const mockResponse = { message: 'Success' }

    const result = isApiError(mockResponse)

    expect(result).toEqual(false)
  })

  it('should return true when input is a treaty error response', () => {
    const mockResponse = {
      status: 404,
      statusText: 'Not Found',
      error: 'Not Found'
    }

    const result = isApiError(mockResponse)

    expect(result).toEqual(true)
  })

  it('should return false when no error in response', () => {
    const mockResponse = {
      statusText: 'Not Found',
      data: {}
    }

    const result = isApiError(mockResponse)

    expect(result).toEqual(false)
  })

  it('should return true when input is not an object', () => {
    const mockResponse = null
    const mockResponse2 = 123

    const result = isApiError(mockResponse)
    const result2 = isApiError(mockResponse2)

    expect(result).toEqual(true)
    expect(result2).toEqual(true)
  })
})
