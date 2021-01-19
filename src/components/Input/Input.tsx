/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import InputMaskComponent from 'react-input-mask';
import MaskedInput from 'react-text-mask';
import { FormGroup, GenericModel } from '../../hooks/form/form-hook';
import { requiredId, maxLengthId } from '../../validators';
import { createNumberMask } from 'text-mask-addons';

export interface Props<T extends GenericModel<T>> {
  /**
   * The key to the form property that should be associated with this input
   */
  formKey: keyof T;
  /**
   * The HTML type of this form
   */
  type: 'radio' | 'number' | 'text' | 'password' | 'email' | 'url';
  /**
   * Optional: you can provide a variable here to be used as the input HTML value
   * WARNING: This can deactivate the automatic form updates
   */
  value?: string | number;

  /**
   * This controls if the input should show the errors found in the form for the provided form key
   */
  showErrors?: boolean;
  /**
   * This tells the input if this input is required or not - if you are using required validator from our form
   * This required prop will be automatically filled accordingly - unless you override it
   */
  required?: boolean;
  /**
   * This sets the input HTML id
   */
  id?: string;
  /**
   * This sets a class for the div and input HTML
   */
  className?: string;
  /**
   * This sets the label for the input
   */
  label: string;
  /**
   * This sets the placeholder for the input
   */
  placeholder?: string;
  /**
   * This defines if the input is disabled
   */
  disabled?: boolean;
  /**
   * This sets the input max length - this will be autofilled if you are using the maxLength validator
   * Unless you override it.
   */
  maxLength?: number;
  /**
   * This sets the input autocomplete HTML property
   */
  autocomplete?: string;
  /**
   * This tells the input if it has any errors - this will be autofilled if you are using this library's form
   */
  error?: string;
  /**
   * This sets a mask for the input
   * 9 for digits
   * a for letters
   * \ is the escape character
   */
  mask?: string;
  /**
   * This defines the complete form that has this input's value
   */
  form: FormGroup<T>;
  /**
   * This defines if the input is a currency input
   */
  currency?: boolean;
  /**
   * This defines if the input is a percentage input
   */
  percentage?: boolean;
  /**
   * This hides the * that shows up when the input is required
   */
  hideRequired?: boolean;
  /**
   * This hides the input's label
   */
  hideLabel?: boolean;
  /**
   * This defines if the Input component should be rendered with his CSS styles
   */
  includeStyles?: boolean;
  /**
   * This function runs when the user press enter while focusing the input
   */
  onEnter?: () => any;
  /**
   * This function runs when the user inserts data in this input
   */
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

const defaultMaskOptions = {
  prefix: 'R$',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2,
  allowNegative: false,
  allowLeadingZeroes: false,
  inputMode: 'numeric'
};
const currencyMask = createNumberMask({
  ...defaultMaskOptions
});

const percentageMaskOptions = {
  prefix: '',
  suffix: '%',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2,
  allowNegative: false,
  allowLeadingZeroes: false,
  inputMode: 'numeric'
};
const percentageMask = createNumberMask({
  ...percentageMaskOptions
});

/**
 * This component will instance an HTML label and input tag and will handle changes appropriately, updating your form when needed as the user types data in
 * You just need to provide your entire form and the key for the property that should be associated to this input
 * @param props - The default component props, look at the Props interface to get more details
 */
function Input<T extends GenericModel<T>>(
  props: PropsWithChildren<Props<T>>
): ReactElement<any, any> | null {
  useEffect(() => {
    if (props.includeStyles) {
      require('./Input.scss');
    }
  }, [props.includeStyles]);

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
  const required = !props.hideRequired
    ? props.required === undefined
      ? !!props.form?.builder?.[props.formKey]?.validators?.find(
          (validator) => validator.id === requiredId
        )
      : props.required
    : false;
  const value =
    props.value === undefined
      ? (props.form?.state?.[props.formKey]?._value as string | number)
      : props.value;
  const maxLength = props.form?.builder?.[props.formKey]?.validators?.find(
    (validator) => validator.id === maxLengthId
  )?.maxLength;
  const name = props.formKey || props.id || props.label.replace(' ', '');
  const inputOptionalProps = props.mask
    ? {}
    : { value: value, onChange: onChange, maxLength };

  const input = (
    <input
      onKeyUp={(event) => {
        if (event.key === 'Enter') {
          if (props.onEnter) {
            props.onEnter();
          }
        }
      }}
      autoComplete={props.autocomplete}
      className={error && showErrors ? 'error' : null}
      placeholder={props.placeholder + (required ? '*' : '')}
      id={props.id}
      name={String(name)}
      type={props.type}
      disabled={props.disabled}
      {...inputOptionalProps}
    />
  );

  return (
    <div
      className={props.className ? props.className + ' Input' : 'Input'}
      {...(props.id ? { id: props.id } : {})}>
      {props.hideLabel ? null : (
        <label
          className={error && showErrors ? 'error' : null}
          htmlFor={String(name)}>
          {props.label}
          {required ? <span className='red-warning'>*</span> : null}
        </label>
      )}
      {props.percentage ? (
        <MaskedInput
          className={error && showErrors ? 'error' : null}
          id={props.id}
          disabled={props.disabled}
          mask={percentageMask}
          onChange={onChange}
          placeholder={props.placeholder}
          value={value}
        />
      ) : props.currency ? (
        <MaskedInput
          className={error && showErrors ? 'error' : null}
          id={props.id}
          disabled={props.disabled}
          mask={currencyMask}
          onChange={onChange}
          placeholder={props.placeholder}
          value={value}
        />
      ) : props.mask ? (
        <InputMaskComponent
          className={error && showErrors ? 'error' : null}
          //@ts-expect-error - InputMask @types package has a few type errors, so, this is required
          maskChar={null}
          value={value}
          onChange={onChange}
          mask={props.mask}>
          {() => input}
        </InputMaskComponent>
      ) : (
        input
      )}
      {error && showErrors ? <span id='error'>*{error}</span> : null}
    </div>
  );
}

export default Input;
