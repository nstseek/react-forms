import React from 'react';
import './Form.scss';

interface Props {
  label: string;
  type: 'text' | 'number' | 'date';
}

const Form: React.FC<Props> = (props) => (
  <div className='Form'>
    <label>{props.label}</label>
    <input type={props.type} />
  </div>
);

export default Form;
