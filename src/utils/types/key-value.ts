interface KeyValue {
  /**
   * This is the key to access the value.
   * This usually doesn't have a meaning to the final user and should be used only under the hood.
   */
  key: number;
  /**
   * This is the value that can be accessed using the key.
   * Usually, you want to show this property to the final user so he can understand what he's choosing.
   */
  value: string;
}

export default KeyValue;
