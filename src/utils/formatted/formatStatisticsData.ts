import { PerformanceCurrent } from 'diary-shared'
import init, * as wasm from '@rust'

/**
 * Функция 'formatStatisticsData' обрабатывает данные оценок, вычисляя статистику на их основе.
 * Извлекает все оценки из 'marks' и вычисляет общее количество, общую сумму оценок и среднюю оценку.
 * Вычисляет количество оценок каждой из категорий (от 2 до 5).
 * Возвращает объект, содержащий общее количество оценок, среднюю оценку и количество оценок для каждой категории.
 * В случае возникновения ошибки, выводит ошибку в консоль и возвращает null.
 */

export const formatStatisticsData = async (marks: PerformanceCurrent) => {
  await init()

  return wasm.format_statistics_data(marks)
}
