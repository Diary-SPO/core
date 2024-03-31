import { describe, expect, it } from 'bun:test'
import type { AcademicRecord } from '@diary-spo/shared'
import { buildSubjectMatrix } from '../index.ts'
import { expectedMatrix, mockData } from './mocs.ts'

/** buildSubjectMatrix **/
describe('buildSubjectMatrix', () => {
  it('should build subject matrix correctly', () => {
    const result = buildSubjectMatrix(mockData)
    expect(result).toEqual(expectedMatrix)
  })

  it('should return empty matrix if data is empty', () => {
    const emptyData: AcademicRecord = { academicYears: [], subjects: [] }
    const result = buildSubjectMatrix(emptyData)
    expect(result).toEqual([])
  })
})
