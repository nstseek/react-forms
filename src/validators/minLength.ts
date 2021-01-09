import { Validator } from '../hooks/form/form-hook';

export const minLengthId = 'minLength';

export const minLength = (
  key: string,
  minLength: number
): Validator<string | number> => ({
  fn: (data: string) => ({
    id: minLengthId,
    message: `O campo ${key} precisa ter no mínimo ${minLength} caracteres`,
    status: data.length > 0 && data.length < minLength
  }),
  minLength,
  id: minLengthId
});
