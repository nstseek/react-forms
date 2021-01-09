import isBoolean from '../utils/type-guards/isBoolean';
import { Validator } from '../hooks/form/form-hook';

export const requiredId = 'required';

export const required = (
  key: string
): Validator<string | number | boolean | number[]> => ({
  fn: (data) => ({
    id: requiredId,
    message: `O campo ${key} é obrigatório`,
    status: isBoolean(data)
      ? data === undefined || data === null
      : Array.isArray(data)
      ? !data.length
      : !data
  }),
  id: requiredId
});
