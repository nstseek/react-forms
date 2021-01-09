import { FormBuilder, FormGroup, FormState } from './form-hook';

class Form<T> implements FormGroup<T> {
  constructor(
    public state: FormState<T>,
    public invalid: boolean,
    public patchValue: (data: Partial<T>) => void,
    public reset: () => void,
    public builder: FormBuilder<T>
  ) {}

  get value(): T {
    const values: T = {} as T;
    Object.keys(this.state).forEach((k) => {
      const key = k as keyof T;
      values[key] = this.state[key].value;
    });
    return values;
  }

  get _value(): T {
    const values: T = {} as T;
    Object.keys(this.state).forEach((k) => {
      const key = k as keyof T;
      values[key] = this.state[key]._value;
    });
    return values;
  }
}

export default Form;
