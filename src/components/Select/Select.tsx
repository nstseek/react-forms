import { FormGroup, GenericModel } from 'hooks/form';
import React, { PropsWithChildren, ReactElement } from 'react';
import './Select.scss';
import { requiredId } from '../../validators';

export interface Option {
  id?: number;
  key: string;
  value: number;
  default?: boolean;
  hidden?: boolean;
}

export interface Props<T extends GenericModel<T>> {
  className?: string;
  formKey: keyof T;
  label: string;
  showErrors?: boolean;
  value?: string | number;
  required?: boolean;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  /**
   * This defines if the Input component should be rendered with his CSS styles
   */
  includeStyles?: boolean;
  onChange?(event: React.ChangeEvent<HTMLSelectElement>): void;
  form: FormGroup<T>;
  options: Option[];
  /**
   * This hides the * that shows up when the input is required
   */
  hideRequired?: boolean;
}

function Select<T extends GenericModel<T>>(
  props: PropsWithChildren<Props<T>>
): ReactElement<any, any> | null {
  const onChange =
    props.onChange === undefined
      ? (event) => {
          props.form.patchValue({
            [props.formKey]: event.target.value
          } as Partial<T>);
        }
      : props.onChange;
  const error =
    props.error === undefined
      ? props.form?.state?.[props.formKey]?.errors?.[0]?.message
      : props.error;
  const showErrors = props.showErrors === undefined ? true : props.showErrors;
  const required = props.hideRequired
    ? false
    : props.required === undefined
    ? !!props.form?.builder?.[props.formKey]?.validators.find(
        (validator) => validator.id === requiredId
      )
    : props.required;
  const value =
    props.value === undefined
      ? (props.form?.state?.[props.formKey]?.value as string | number)
      : props.value;
  const defaultValue = props.options.find((option) => option.default)?.value;
  const name = props.formKey || props.id || props.label.replace(' ', '');

  return (
    <div
      className={`Select${props.includeStyles ? ' styled' : ''}${
        props.className ? ' ' + props.className : ''
      }`}>
      <label
        className={error && showErrors ? 'error' : null}
        htmlFor={String(name)}>
        {props.label}
        {props.required ? <span className='red-warning'>*</span> : null}
      </label>
      <select
        value={value}
        className={error && showErrors ? 'error' : null}
        required={required}
        placeholder={props.placeholder + (props.required ? '*' : '')}
        id={props.id}
        defaultValue={defaultValue}
        name={String(name)}
        disabled={props.disabled}
        onChange={onChange}>
        {props.options.map((option) => (
          <option
            key={option.id || option.value}
            value={option.value}
            style={option.hidden ? { display: 'none' } : null}>
            {option.key}
          </option>
        ))}
      </select>
      {error && showErrors ? <span id='error'>*{error}</span> : null}
    </div>
  );
}

export default Select;
