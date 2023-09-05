const truncateText = (text: string, maxLength: number, removeIfLess: boolean = true): string => {
  if (removeIfLess && text.length < maxLength) {
    return '';
  }

  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

export default truncateText;
