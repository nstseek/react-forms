import Input from '../Input/Input';
import { FormBuilder, FormGroup } from '../../hooks/form/index';
import React, { PropsWithChildren } from 'react';
import './Form.scss';

interface Props<T> {
  /**
   * The complete bootstraped form that will be used to generate the inputs
   */
  form: FormGroup<T>;
  /**
   * This will run when the user presses enter while focusing any input that belongs to this form
   */
  onEnter?: () => any;
  /**
   * This defines if the inputs that belong to this form should show it's errors
   */
  showErrors?: boolean;
}

/**
 * This component generates an HTML structure and links the inputs with the form provided, creating and linking inputs based on the provided form
 * @param props - The default component props, take a look at the Props interface for more details
 */
function Form<T>(
  props: PropsWithChildren<Props<T>>
): React.ReactElement<any, any> | null {
  const defaultInput = (key: string, index: number) => {
    const formKey = key as keyof FormBuilder<T>;
    return (
      <div className='row' key={index}>
        <div className='column'>
          <Input<any>
            onEnter={props.onEnter}
            form={props.form}
            formKey={formKey}
            showErrors={!!props.showErrors}
            {...props.form.builder[formKey].inputOptions}
          />
        </div>
      </div>
    );
  };

  return (
    <form className='Form'>
      {Object.keys(props.form.builder).map((key, index) =>
        defaultInput(key, index)
      )}
    </form>
  );
}

export default Form;
