import { GenericModel } from 'hooks/form';
import Form from 'hooks/form/form-class';
import React, { PropsWithChildren, ReactElement, useState } from 'react';
import { requiredId } from '../../validators';
import Input, { Props as InputProps } from '../Input/Input';
import './Switch.scss';

export enum SwitchTypes {
  Buttons = 0,
  Checkboxes
}

export interface SwitchOption {
  id: number;
  title: string;
  selected: boolean;
  canActivateInput?: boolean;
}

export interface Props<
  T extends GenericModel<T>,
  K extends GenericModel<K> = void
> {
  type: SwitchTypes;
  options: SwitchOption[];
  label: string;
  showErrors: boolean;
  input?: InputProps<K>;
  form: Form<T>;
  formKey: keyof T;
}

/**
 * This component provides a input of type switch. The input will contains a few options that the user can click and select.
 * The user can select only one input at a time. The switch may contain a regular Input that can be activated/deactivated based on the selected option.
 * @param props The default component props. (To be documented in future versions)
 */
function Switch<
  T extends GenericModel<T>,
  K extends GenericModel<K> = GenericModel<Record<string, unknown>>
>(props: PropsWithChildren<Props<T, K>>): ReactElement<any, any> | null {
  const required = !!props.form?.builder?.[props.formKey]?.validators?.find(
    (validator) => validator.id === requiredId
  );
  const showErrors = props.showErrors === undefined ? true : props.showErrors;
  const error = props.form?.state?.[props.formKey]?.errors?.[0]?.message;

  const [inputDisabled, setInputDisabled] = useState(true);

  const checkInputDisabled = (id: number) => {
    if (props.options.find((option) => option.id === id)?.canActivateInput) {
      setInputDisabled(false);
    } else {
      props.input.form.patchValue({
        [props.input.formKey]: ''
      } as Partial<K>);
      setInputDisabled(true);
    }
  };

  return (
    <div className='Switch'>
      <label
        className={error && showErrors ? 'error' : null}
        htmlFor={String(name)}>
        {props.label}
        {required ? <span className='red-warning'>*</span> : null}
      </label>
      <div id='options'>
        {props.type === SwitchTypes.Buttons ? (
          <>
            {props.options.map((option) => (
              <button
                className={
                  props.form.state[props.formKey]._value === option.id
                    ? 'selected'
                    : null
                }
                key={option.id}
                onClick={() => {
                  if (props.input) {
                    checkInputDisabled(option.id);
                  }
                  props.form.patchValue({
                    [props.formKey]: option.id
                  } as Partial<T>);
                }}>
                {option.title}
              </button>
            ))}
            {props.input ? (
              <Input
                {...props.input}
                className={
                  props.input.className
                    ? props.input.className + ' switch-input'
                    : 'switch-input'
                }
                disabled={inputDisabled}
              />
            ) : null}
          </>
        ) : null}
      </div>
      {error && showErrors ? <span id='error'>*{error}</span> : null}
    </div>
  );
}

export default Switch;
