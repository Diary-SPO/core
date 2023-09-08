import { Link } from '@vkontakte/vkui';

const textToLink = (name: string) => {
  const urlRegex = /(https?:\/\/\S+)/g;

  const parts = name.split(urlRegex);

  const formattedParts = parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return <Link key={index} href={part} target='_blank'>{part}</Link>;
    }
    return part;
  });

  return formattedParts;
};

export default textToLink;
