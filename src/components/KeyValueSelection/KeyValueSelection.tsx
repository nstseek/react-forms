import React from 'react';
import KeyValue from 'utils/types/key-value';
import './KeyValueSelection.scss';

interface Props {
  add: () => void;
  remove: (id: number) => void;
  keyValues: KeyValue[];
  label: string;
  buttonLabel: string;
  maxItems?: number;
}

const KeyValueSelection: React.FC<Props> = (props) => {
  return (
    <div className='KeyValueSelection'>
      <label htmlFor={String(props.label)}>{props.label}</label>
      {props.keyValues && props.keyValues.length ? (
        <div id='list'>
          {(props.maxItems ? props.keyValues.slice(0, 4) : props.keyValues).map(
            (keyValue) => (
              <div className='card' key={keyValue.key}>
                {keyValue.value}
                <span
                  className='clickable'
                  id='close'
                  onClick={() => props.remove(keyValue.key)}>
                  X
                </span>
              </div>
            )
          )}
        </div>
      ) : null}
      <button onClick={props.add}>+ ADICIONAR {props.buttonLabel}</button>
    </div>
  );
};

export default KeyValueSelection;
