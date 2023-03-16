export const currency = (
  value: bigint | number | string,
  params?: { locale?: string; options: { currency?: string; style?: string; [key: string]: any } }
) => {
  // merge options
  params = Object.assign(
    { locale: 'en-us', options: { currency: 'USD', style: 'currency' } },
    params
  );

  // destructure params
  const { locale, options } = params;

  const { format } = new Intl.NumberFormat(locale, options);

  if (typeof value === 'string') value = parseFloat(value);

  return format(value);
};
