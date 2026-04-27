const getFieldError = (errors, fieldName) => {
  const fieldErrors = errors?.[fieldName];
  return Array.isArray(fieldErrors) && fieldErrors.length > 0 ? fieldErrors[0] : "";
};

export default getFieldError;
