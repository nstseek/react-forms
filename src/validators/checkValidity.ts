import Form from '../hooks/form/form-class';

/**
 * The object that will be sent to the addModal function
 */
export interface ModalBase {
  title: string;
  desc: string;
  type: 'ok' | 'warning' | 'error';
}

/**
 * This function will check your form validity for you and will pop up error messages appopriately for you using the addModal function
 * @param form - The form that will be tested
 * @param addModal - The function that will be called when an error is found
 */
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
