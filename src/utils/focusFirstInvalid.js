/**
 * After a failed validation, move focus to the first field (in DOM order)
 * that has an error, so keyboard and screen-reader users land on it.
 * `errors` is the `{ [name]: string[] }` shape formatZodErrors returns.
 */
const focusFirstInvalid = (formElement, errors) => {
  const field = [...(formElement?.elements ?? [])].find(
    (element) => element.name && errors[element.name]?.length,
  );
  field?.focus();
};

export default focusFirstInvalid;
