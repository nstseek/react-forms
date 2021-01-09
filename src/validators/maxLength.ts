import { Validator } from '../hooks/form/form-hook';

export const maxLengthId = 'maxLength';

export const maxLength = (
  key: string,
  maxLength: number
): Validator<string | number> => ({
  fn: (data: string) => ({
    id: maxLengthId,
    message: `O campo ${key} precisa ter no máximo ${maxLength} caracteres`,
    status: data.length > 0 && data.length > maxLength
  }),
  maxLength,
  id: maxLengthId
});
