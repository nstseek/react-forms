import React from 'react';
import { FormKeyValue } from '../../ModalKeyValue';
import './KeyValue.scss';

interface Props {
  keyValue: FormKeyValue;
  onClick?: (keyValue: FormKeyValue) => any;
}

const KeyValue: React.FC<Props> = (props) => (
  <div
    className={`KeyValue clickable ${
      props.keyValue.selected ? 'selected' : ''
    }`}
    onClick={() => (props.onClick ? props.onClick(props.keyValue) : '')}>
    <div id='round'></div> {props.keyValue.value}
  </div>
);

export default KeyValue;
