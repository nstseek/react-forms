import Form from '../hooks/form/form-class';

export interface ModalBase {
  title: string;
  desc: string;
  type: 'ok' | 'warning' | 'error';
}

export const checkValidity = (
  form: Form<any>,
  addModal?: (modal: ModalBase) => any
) => {
  if (form.invalid) {
    const formControls = Object.values(form.state);
    for (const formControl of formControls) {
      if (formControl.errors.length) {
        if (addModal) {
          addModal({
            desc: formControl.errors[0].message,
            title: 'Erro de validação',
            type: 'error'
          });
        }
        return false;
      }
    }
    return false;
  } else {
    return true;
  }
};
