import Input from '../Input/Input';
import { FormGroup } from '../../hooks/form/index';
import React, { PropsWithChildren } from 'react';
import './Form.scss';
import Select from '../Select/Select';

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
 * @param props - The default component props. Take a look at the Props interface for more details. (To be documented)
 */
function Form<T>(
  props: PropsWithChildren<Props<T>>
): React.ReactElement<any, any> | null {
  const defaultInput = (formKey: keyof T, index: number) => {
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
  const defaultSelect = (formKey: keyof T, index: number) => {
    return (
      <div className='row' key={index}>
        <div className='column'>
          <Select<any>
            form={props.form}
            formKey={formKey}
            showErrors={!!props.showErrors}
            {...props.form.builder[formKey].selectOptions}
          />
        </div>
      </div>
    );
  };

  return (
    <form className='Form'>
      {Object.keys(props.form.builder).map((k, index) => {
        const key = k as keyof T;
        if (props.form.builder[key].inputOptions) {
          return defaultInput(key, index);
        } else if (props.form.builder[key].selectOptions) {
          return defaultSelect(key, index);
        }
      })}
    </form>
  );
}

export default Form;
