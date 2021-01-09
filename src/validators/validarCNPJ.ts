import { Validator } from '../hooks/form/form-hook';

const validarCNPJ = (cnpjData: number | string) => {
  cnpjData = String(cnpjData).replace(/[^\d]+/g, '');

  if (cnpjData === '') {
    return false;
  }

  if (cnpjData.length !== 14) {
    return false;
  }

  // Elimina cnpjDatas invalidos conhecidos
  if (
    cnpjData === '00000000000000' ||
    cnpjData === '11111111111111' ||
    cnpjData === '22222222222222' ||
    cnpjData === '33333333333333' ||
    cnpjData === '44444444444444' ||
    cnpjData === '55555555555555' ||
    cnpjData === '66666666666666' ||
    cnpjData === '77777777777777' ||
    cnpjData === '88888888888888' ||
    cnpjData === '99999999999999'
  ) {
    return false;
  }

  // Valida DVs
  let tamanho = cnpjData.length - 2;
  let numeros = cnpjData.substring(0, tamanho);
  const digitos = cnpjData.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cnpjData.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(1))) {
    return false;
  }

  return true;
};

export const cnpjId = 'cnpj';

export const cnpj: Validator<string> = {
  id: cnpjId,
  fn: (data) => ({
    id: cnpjId,
    message:
      String(data).replace(/[^\d]+/g, '').length === 0
        ? 'O campo CNPJ é obrigatório'
        : String(data).replace(/[^\d]+/g, '').length < 14
        ? 'O CNPJ precisa conter 14 dígitos'
        : 'O CNPJ informado é inválido',
    status: !validarCNPJ(data)
  })
};
