import { describe, expect, it } from 'bun:test'
import { PerformanceCurrent } from '@diary-spo/shared'
import { formatStatisticsData } from '../helpers.ts'
/** formatStatisticsData **/
describe('должна создать коллекцию с нужными полями', () => {
  const testData: PerformanceCurrent = {
    daysWithMarksForSubject: [
      {
        averageMark: 'Five',
        daysWithMarks: [
          {
            day: new Date(),
            markValues: ['Five', 'Five', 'Four']
          }
        ],
        subjectName: 'Иностранный язык в профессиональной деятельности'
      }
    ],
    monthsWithDays: [
      {
        month: {
          name: 'Сентябрь',
          num: 9
        },
        daysWithLessons: [new Date()]
      }
    ]
  }

  it('должна вернуть правильные данные при валидных параметрах', () => {
    const result = formatStatisticsData(testData)

    expect(result).not.toBeNull()

    expect(result).toHaveProperty('totalNumberOfMarks')
    expect(result).toHaveProperty('averageMark')
    expect(result).toHaveProperty('markCounts')

    expect(result.totalNumberOfMarks).toBe(3)
    expect(result.averageMark).toBeCloseTo(4.667, 3)

    expect(result.markCounts).toEqual({
      '2': 0,
      '3': 0,
      '4': 1,
      '5': 2
    })
  })

  it('должна вернуть null, если массив пустой', () => {
    // @ts-expect-error Пустой массив не передаётся никогда, но лучше этот случай покрыть тестом
    const result = formatStatisticsData({ daysWithMarksForSubject: [] })

    expect(result).toBeNull()
  })
})
