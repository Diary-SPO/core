import { PerformanceCurrent } from '@diary-spo/shared'
import {
  convertStringToTime,
  formatDate,
  formatDateForRequest,
  formatLessonDate,
  formatLessonName,
  formatStatisticsData
} from '@utils'
import { describe, expect, it } from 'vitest'

describe('Тесты утилит для форматирования', () => {
  /** convertStringToTime **/
  it('должна конвертировать строку времени в объект Date', async ({
    expect
  }) => {
    const baseDate = new Date(2023, 10, 1, 0, 0, 0)
    const result = convertStringToTime('14:30', baseDate)
    expect(result.getHours()).toBe(14)
    expect(result.getMinutes()).toBe(30)
  })

  it('должна вернуть null для некорректного формата времени', async ({
    expect
  }) => {
    const baseDate = new Date(2023, 10, 1, 0, 0, 0)
    const result = convertStringToTime('25:70', baseDate)
    expect(result).toBe(null)
  })

  /** formatDate **/
  it('должна форматировать строку даты в объект Date', async ({ expect }) => {
    const result = formatDate('01.11.2023')
    expect(result.getFullYear()).toBe(2023)
    expect(result.getMonth()).toBe(10)
    expect(result.getDate()).toBe(1)
  })

  /** formatDateForRequest **/
  it('должна форматировать объект Date в строку', async ({ expect }) => {
    const date = new Date(2023, 10, 1)
    const result = formatDateForRequest(date)
    expect(result).toBe('2023-11-01')
  })

  /** formatLessonDate **/
  it('должна правильно форматировать дату урока', async ({ expect }) => {
    const date = new Date(2023, 10, 1)
    const result = formatLessonDate(date)
    expect(result).toBe('1 ноября 2023 г.')
  })

  /** formatLessonName **/
  it('должна корректно форматировать название урока', async ({ expect }) => {
    const lessonName = 'МДК 01.01/1 подгруппа'
    const result = formatLessonName(lessonName)
    expect(result).toBe('МДК 01.01 (1 подгруппа)')
  })

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
})
