export const objectToFormData = (object: { [key: string]: any }) => {
  const formData = new FormData();

  for (const key in object) {
    formData.append(key, object[key]);
  }

  return formData;
};
