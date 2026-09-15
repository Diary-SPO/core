import { describe, expect, test } from 'bun:test'
import type { PerformanceCurrent } from '@diary-spo/shared'

import {
  createGradeSnapshot,
  diffGradeSnapshots,
  formatGradeNotification
} from './grade-notifications.ts'

const performance = (
  marks: PerformanceCurrent['daysWithMarksForSubject']
): PerformanceCurrent => ({
  daysWithMarksForSubject: marks,
  monthsWithDays: []
})

describe('grade notifications', () => {
  test('detects added and updated grades', () => {
    const previous = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [
            {
              day: new Date('2026-09-07T00:00:00'),
              markValues: ['Four', 'Three']
            }
          ],
          subjectName: 'Математика'
        }
      ])
    )
    const current = createGradeSnapshot(
      performance([
        {
          averageMark: 'Five',
          daysWithMarks: [
            {
              day: new Date('2026-09-07T00:00:00'),
              markValues: ['Five', 'Three']
            },
            { day: new Date('2026-09-08T00:00:00'), markValues: ['Five'] }
          ],
          subjectName: 'Математика'
        }
      ])
    )

    expect(diffGradeSnapshots(previous, current)).toEqual([
      {
        day: '2026-09-07',
        mark: 'Five',
        marks: ['Five', 'Three'],
        previousMark: 'Four',
        subjectName: 'Математика',
        type: 'UPDATE'
      },
      {
        day: '2026-09-08',
        mark: 'Five',
        marks: ['Five'],
        subjectName: 'Математика',
        type: 'ADD'
      }
    ])
  })

  test('detects a deleted grade', () => {
    const previous = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [
            { day: new Date('2026-09-07'), markValues: ['Four'] }
          ],
          subjectName: 'Физика'
        }
      ])
    )
    const current = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [],
          subjectName: 'Физика'
        }
      ])
    )

    expect(diffGradeSnapshots(previous, current)[0]).toMatchObject({
      mark: 'Four',
      type: 'DELETE'
    })
  })

  test('does not report reordered grades as changes', () => {
    const first = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [
            { day: new Date('2026-09-07'), markValues: ['Five', 'Four'] }
          ],
          subjectName: 'Физика'
        }
      ])
    )
    const second = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [
            { day: new Date('2026-09-07'), markValues: ['Four', 'Five'] }
          ],
          subjectName: 'Физика'
        }
      ])
    )

    expect(diffGradeSnapshots(first, second)).toEqual([])
  })

  test('compares repeated grades as a multiset', () => {
    const first = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [
            { day: new Date('2026-09-07'), markValues: ['Four', 'Four'] }
          ],
          subjectName: 'Физика'
        }
      ])
    )
    const second = createGradeSnapshot(
      performance([
        {
          averageMark: 'Four',
          daysWithMarks: [
            { day: new Date('2026-09-07'), markValues: ['Four', 'Five'] }
          ],
          subjectName: 'Физика'
        }
      ])
    )

    expect(diffGradeSnapshots(first, second)[0]).toMatchObject({
      mark: 'Five',
      previousMark: 'Four',
      type: 'UPDATE'
    })
  })

  test('formats an update notification', () => {
    expect(
      formatGradeNotification({
        day: '2026-09-07',
        mark: 'Five',
        marks: ['Five'],
        previousMark: 'Four',
        subjectName: 'Физика',
        type: 'UPDATE'
      })
    ).toEqual({
      body: '4 → 5 · Физика, 07.09.2026',
      title: '5️⃣ Оценка изменена'
    })
  })
})
