export const date = (date: Date, locale: string = 'fr-CA'): string => {
  const { format } = new Intl.DateTimeFormat(locale);

  return format(date);
};
