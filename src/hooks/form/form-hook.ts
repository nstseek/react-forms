import { useState } from 'react';
import Form from './form-class';

export interface Error {
  id: string;
  message: string;
  status: boolean;
}

export interface Validator<T> {
  fn: ValidatorFn<T>;
  maxLength?: number;
  minLength?: number;
  id: string;
}

interface FormBase<T> {
  initialValue: T;
  validators?: Validator<T>[];
  getter?: (this: FormControl<T>) => T;
}

export interface FormControl<T> {
  value: T;
  _value: T;
  errors: Error[];
}

export type ValidatorFn<T> = (data: T) => Error;

export type FormBuilder<T> = {
  [K in keyof T]: FormBase<T[K]>;
};

export type FormState<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export type FormGroup<T> = {
  state: FormState<T>;
  invalid: boolean;
  patchValue: (data: Partial<T>) => void;
  reset: () => void;
  builder: FormBuilder<T>;
};

export type GenericModel<T> = {
  [K in keyof T]: string | number | boolean | number[];
};

// type FormUpdate<T extends FormGroup<T>> = {
//   [K in keyof T]: T[K]['value'];
// }

// type ExtractModel<T extends FormBuilder<T>> = {
//   [K in keyof T]: T[K]['initialValue'];
// }

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
      throw new ErrorEvent(
        'The form does not exist! You cannot update a non existant form.'
      );
    }
    if (onChange) {
      onChange(formData);
    }

    const tmpForm = { ...form };
    Object.keys(formData).forEach((k) => {
      const key = k as keyof T;
      tmpForm[key] = {
        get value() {
          return model[key].getter ? model[k].getter.call(this) : this._value; // ??? wtf
        },
        _value: formData[key],
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
