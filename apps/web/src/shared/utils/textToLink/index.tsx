import { Link } from '@vkontakte/vkui'

/**
 * Функция 'textToLink' преобразует текст в ссылку, разделяя текст на части в соответствии с регулярным выражением /(https?:\/\/\S+)/g.
 * Принимает строку 'name' и разбивает её на части в соответствии с регулярным выражением urlRegex.
 * Далее, для каждой части текста, проверяет, соответствует ли она регулярному выражению urlRegex.
 * Если текст является ссылкой, возвращает компонент Link с полученной ссылкой и ключом 'index', открывая её в новой вкладке.
 * Иначе возвращает часть текста без изменений.
 */

export const textToLink = (name: string) => {
  const urlRegex = /(https?:\/\/\S+)/g

  const parts = name.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Link key={index} href={part} target='_blank'>
          {part}
        </Link>
      )
    }

    return part
  })
}
