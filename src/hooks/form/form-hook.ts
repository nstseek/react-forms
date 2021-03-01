import { useState } from 'react';
import Form from './form-class';
import { Props as InputProps } from '../../components/Input/Input';
import { Props as SelectProps } from '../../components/Select/Select';

type InputOptions = Omit<InputProps<any>, 'formKey' | 'form'>;

type SelectOptions = Omit<SelectProps<any>, 'formKey' | 'form'>;

export type RawTypes = string | number;

export interface Error {
  id: string;
  message: string;
  status: boolean;
}

/**
 * This interface defines how a validator object should look like, the generic type<T> stands for the type being passed to the validation function
 */
export interface Validator<T> {
  fn: ValidatorFn<T>;
  maxLength?: number;
  minLength?: number;
  id: string;
}

/**
 * This interface defines how an entry in the form configuration object looks like
 @type T - This is the input value type. E.g. string, number, etc
 */
interface FormBase<T> {
  initialValue: T | '';
  validators?: Validator<RawTypes>[];
  getter?: (this: FormControl<T>) => T;
  inputOptions?: InputOptions;
  selectOptions?: SelectOptions;
}

/**
 * This interface defines how a state inside the built form looks like
 * @type T - This is the value type. E.g. string, number,
 * @property value - This property has the value returned by the getter (when appliable)
 * @property _value - This property has the original raw value
 * @property errors - This is an array containing the errors of this form input (when appliable)
 */
export interface FormControl<T> {
  value: T;
  _value: RawTypes;
  errors: Error[];
}

/**
 * This is the type that defines a validation function
 */
export type ValidatorFn<T> = (data: T) => Error;

/**
 * This is the type that you should use to build the form configuration object
 * @type T - This is your model base type, each property will be a field in the form
 */
export type FormBuilder<T> = {
  [K in keyof T]: FormBase<T[K]>;
};

/**
 * This is the type of the form state
 * @type T - This is your model base type, each property of this type will be a property in the form state
 */
export type FormState<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

/**
 * This is the final interface, a built form looks like this
 * @type T - This type is your model base type
 */
export type FormGroup<T> = {
  state: FormState<T>;
  invalid: boolean;
  patchValue: (data: Partial<T>) => void;
  reset: () => void;
  builder: FormBuilder<T>;
};

/**
 * This creates constraints for your model
 * This asserts that your model doesn't have objects or non-primitive types inside of it, since this is not supported
 */
export type GenericModel<T> = {
  [K in keyof T]: any;
};

/**
 * This is the hook that will create a form for you
 * @param model - This should be your configuration object, a FormBuilder<T> object
 * @param onChange - This is an optional parameter, it is a function that will receive every change from your form. This was created for debugging purposes.
 */
export default function useForm<T extends GenericModel<T>>(
  model: FormBuilder<T>,
  onChange?: (data) => void
): Form<T> {
  const [form, setForm] = useState<FormState<T>>(null);
  const [invalid, setInvalid] = useState<boolean>(false);

  const runValidators = (validators: Validator<T>[], data: T) => {
    const results = validators.map((validator) => validator.fn(data));
    return results.filter((result) => result.status);
  };

  const resetForm = () => {
    const tmpForm = {} as FormState<T>;
    Object.keys(model).forEach((k) => {
      const key = k as keyof T;
      tmpForm[k] = {
        get value() {
          return model[key].getter ? model[k].getter.call(this) : this._value;
        },
        _value: model[key].initialValue,
        errors: model[key].validators
          ? runValidators(model[k].validators, model[k].initialValue)
          : []
      };
    });
    setForm(tmpForm);
    setInvalid(
      !!Object.values(tmpForm).find(
        (control: FormControl<any>) => control.errors.length
      )
    );
  };

  const updateForm = (formData: Partial<T>): void => {
    if (!form) {
      throw new Error(
        'The form does not exist! You cannot update a non existant form.'
      );
    }
    if (onChange) {
      onChange(formData);
    }

    const tmpForm = { ...form };
    const formKeys = Object.keys(form);
    Object.keys(formData).forEach((k) => {
      if (!formKeys.find((formKey) => formKey === k)) {
        return;
      }
      const key = k as keyof T;
      tmpForm[key] = {
        get value() {
          return model[key].getter ? model[k].getter.call(this) : this._value; // ??? wtf
        },
        _value: formData[key] as string,
        errors: model[key].validators
          ? runValidators(model[k].validators, formData[k])
          : []
      };
    });
    setForm(tmpForm);
    setInvalid(
      !!Object.values(tmpForm).find(
        (control: FormControl<any>) => control.errors.length
      )
    );
  };

  if (!form) {
    resetForm();
  }

  return new Form(form, invalid, updateForm, resetForm, model);
}
