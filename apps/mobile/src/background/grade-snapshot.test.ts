import { describe, expect, test } from 'bun:test'

import { forgetOneMark, parseGradeSnapshot } from './grade-snapshot.ts'

describe('parseGradeSnapshot', () => {
  test('returns null for empty or corrupt values', () => {
    expect(parseGradeSnapshot(null)).toBeNull()
    expect(parseGradeSnapshot('')).toBeNull()
    expect(parseGradeSnapshot('{')).toBeNull()
    expect(parseGradeSnapshot('[]')).toBeNull()
    expect(parseGradeSnapshot('{"version":1}')).toBeNull()
  })

  test('returns a valid snapshot', () => {
    const snapshot = {
      version: 1 as const,
      entries: {
        '["Математика","2026-09-01"]': {
          day: '2026-09-01',
          marks: ['Five' as const],
          subjectName: 'Математика'
        }
      }
    }
    expect(parseGradeSnapshot(JSON.stringify(snapshot))).toEqual(snapshot)
  })
})

describe('forgetOneMark', () => {
  test('removes the last mark and drops an empty entry', () => {
    const snapshot = {
      version: 1 as const,
      entries: {
        a: {
          day: '2026-09-01',
          marks: ['Four' as const, 'Five' as const],
          subjectName: 'Химия'
        },
        b: {
          day: '2026-09-02',
          marks: ['Three' as const],
          subjectName: 'Физика'
        }
      }
    }

    const first = forgetOneMark(snapshot)
    expect(first?.forgotten).toEqual({
      day: '2026-09-01',
      mark: 'Five',
      subjectName: 'Химия'
    })
    expect(first?.snapshot.entries.a.marks).toEqual(['Four'])

    const second = forgetOneMark(first!.snapshot)
    expect(second?.forgotten.mark).toBe('Four')
    expect(second?.snapshot.entries.a).toBeUndefined()

    const third = forgetOneMark(second!.snapshot)
    expect(third?.forgotten).toEqual({
      day: '2026-09-02',
      mark: 'Three',
      subjectName: 'Физика'
    })
    expect(Object.keys(third!.snapshot.entries)).toEqual([])

    expect(forgetOneMark(third!.snapshot)).toBeNull()
  })
})
