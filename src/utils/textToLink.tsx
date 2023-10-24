import { Link } from '@vkontakte/vkui'

const textToLink = (name: string) => {
  const urlRegex = /(https?:\/\/\S+)/g

  const parts = name.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Link key={index} href={part} target="_blank">
          {part}
        </Link>
      )
    }
    return part
  })
}

export default textToLink
