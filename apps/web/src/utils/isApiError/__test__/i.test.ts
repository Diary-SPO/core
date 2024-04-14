import { describe, expect, it } from 'bun:test'
import { isApiError } from '@utils'

describe('isApiError', () => {
  it('should return false when input is not an AxiosResponse', () => {
    const mockResponse = { message: 'Success' }

    const result = isApiError(mockResponse)

    expect(result).toEqual(false)
  })

  it('should return true when input is an AxiosResponse', () => {
    const mockResponse = {
      status: 404,
      statusText: 'Not Found',
      data: {}
    }

    const result = isApiError(mockResponse)

    expect(result).toEqual(true)
  })

  it('should return false when no status in response', () => {
    const mockResponse = {
      statusText: 'Not Found',
      data: {}
    }

    const result = isApiError(mockResponse)

    expect(result).toEqual(false)
  })
})
