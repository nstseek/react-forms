import { FormBuilder, FormGroup, FormState } from './form-hook';

class Form<T> implements FormGroup<T> {
  constructor(
    /**
     * This property contains your form's state, you can check here for errors and values
     */
    public state: FormState<T>,
    /**
     * This property contains your form's validation state, if any field has errors, the form is considered invalid
     */
    public invalid: boolean,
    /**
     * This function should be used to change your entire form, receiving an object that has the form's original Model as the type
     * @param data - This is the object containing the new values
     */
    public patchValue: (data: Partial<T>) => void,
    /**
     * This function resets your form to the original, first-built state
     */
    public reset: () => void,
    /**
     * This property contains the original form builder, the configuration object that was used to build the form
     */
    public builder: FormBuilder<T>
  ) {}

  /**
   * This getter will return the form value for you as a single object, just like the original Model
   */
  get value(): T {
    const values: T = {} as T;
    Object.keys(this.state).forEach((k) => {
      const key = k as keyof T;
      values[key] = this.state[key].value;
    });
    return values;
  }

  /**
   * This getter will return the raw form value for you as a single object, just like the original Model
   */
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
