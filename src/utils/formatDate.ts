export const formatDate = (dateString: string) => {
  const parts = dateString.split('.');
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
};
