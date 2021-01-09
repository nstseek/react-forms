import { Validator } from '../hooks/form/form-hook';

export const telefoneId = 'telefone';

export const telefone = (
  key: string,
  numeros: number
): Validator<string | number> => ({
  fn: (data: string) => ({
    id: telefoneId,
    message: `O campo ${key} precisa ter no mínimo ${numeros} dígitos`,
    status: String(data).replace(/[^\d]+/g, '').length < numeros
  }),
  id: telefoneId
});
