import { Validator } from '../hooks/form/form-hook';

const validarCPF = (cpf: string | number) => {
  cpf = String(cpf).replace(/[^\d]+/g, '');
  if (cpf === '') {
    return false;
  }
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return false;
  }
  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(9), 10)) {
    return false;
  }
  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== parseInt(cpf.charAt(10), 10)) {
    return false;
  }
  return true;
};

export const cpfId = 'cpf';

export const cpf: Validator<string> = {
  id: cpfId,
  fn: (data) => ({
    id: cpfId,
    message:
      String(data).replace(/[^\d]+/g, '').length === 0
        ? 'O campo CPF é obrigatório'
        : String(data).replace(/[^\d]+/g, '').length < 11
        ? 'O CPF precisa conter 11 dígitos'
        : 'O CPF informado é inválido',
    status: !validarCPF(data)
  })
};
