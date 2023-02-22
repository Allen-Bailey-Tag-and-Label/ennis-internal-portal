export const formDataToObject = (formData: FormData) => {
  const obj: { [key: string]: string | File } = {};
  formData.forEach((value, key) => {
    try {
      if (typeof value === 'string') obj[key] = JSON.parse(value);
    } catch (error) {
      obj[key] = value;
    }
  });
  return obj;
};
