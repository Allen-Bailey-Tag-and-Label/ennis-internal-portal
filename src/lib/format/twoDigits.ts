export const twoDigits = (
  value: bigint | number | string,
  params?: {
    locale?: string;
    options?: { minimumFractionDigits: number; maximumFractionDigits: number };
  }
) => {
  // merge options
  params = Object.assign(
    { locale: 'en-us', options: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
    params
  );

  // destructure params
  const { locale, options } = params;

  const { format } = new Intl.NumberFormat(locale, options);

  if (typeof value === 'string') value = parseFloat(value.replace(/[^\d|.]/g, ''));

  return format(value);
};
