export const formatLessonDate = (dateString: Date | string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Date(dateString).toLocaleDateString(undefined, options);
};
