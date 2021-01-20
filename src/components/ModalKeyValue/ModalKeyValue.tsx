import React, { useEffect, useState } from 'react';
import './ModalKeyValue.scss';
import KeyValue from './components/KeyValue/KeyValue';
import _ from 'lodash';
import KeyValueModel from '../../utils/types/key-value';
import { Backdrop } from '@nstseek/react-ui/components';

export interface FormKeyValue extends KeyValueModel {
  selected?: boolean;
}

interface Props {
  title: string;
  pesquisaTitle: string;
  selecioneTitle: string;
  buttonTitle: string;
  keyValues: FormKeyValue[];
  selected: number[];
  close: (keys: number[]) => void;
}

const ModalKeyValue: React.FC<Props> = (props) => {
  const [pesquisa, setPesquisa] = useState<string>('');
  const [keyValues, setKeyValues] = useState<FormKeyValue[]>([
    ...props.keyValues
  ]);
  const [selecionados, setSelecionados] = useState(0);

  useEffect(() => {
    let counter = 0;
    for (const keyValue of keyValues) {
      if (keyValue.selected) {
        counter++;
      }
    }
    setSelecionados(counter);
  }, [keyValues]);

  useEffect(() => {
    const newKeyValues = [...keyValues].map((keyValue) => ({
      ...keyValue,
      selected: props.selected.findIndex((key) => keyValue.key === key) >= 0
    }));
    setKeyValues(newKeyValues);
  }, [props.selected]);

  const mapKeyValues = (keyValue) => (
    <KeyValue
      key={keyValue.key}
      keyValue={keyValue}
      onClick={() => {
        const newKeyValues = [...keyValues];
        const changedKvIndex = newKeyValues.findIndex(
          (kV) => kV.key === keyValue.key
        );
        newKeyValues[changedKvIndex].selected = !newKeyValues[changedKvIndex]
          .selected;
        setKeyValues(newKeyValues);
      }}
    />
  );

  const sortSelectedKeyValues = (a: FormKeyValue, b: FormKeyValue): number => {
    if (a.selected && !b.selected) {
      return -1;
    }
    if ((a.selected && b.selected) || (!a.selected && !b.selected)) {
      return 0;
    }
    if (b.selected && !a.selected) {
      return 1;
    }
  };

  return (
    <Backdrop zIndex={1500} onBackdropClick={() => props.close(null)}>
      <div className='ModalKeyValue'>
        <div id='header'></div>
        <div id='content'>
          <p id='add'>ADICIONAR</p>
          <p id='nome'>{props.title}</p>
          <p id='pesquisa'>Pesquisa por {props.pesquisaTitle}</p>
          <div id='pesquisa'>
            <input
              id='pesquisa'
              type='text'
              placeholder='Pesquisar'
              onChange={(event) => setPesquisa(event.target.value)}
            />
            <i className='fa fa-search'></i>
          </div>
          <p id='selecione'>{props.selecioneTitle}</p>
          <p id='marcar-desmarcar' className='clickable'>
            <span
              onClick={() => {
                const newKeyValues = [...keyValues];
                newKeyValues.forEach((keyValue) => (keyValue.selected = true));
                setKeyValues(newKeyValues);
              }}>
              Marcar todos
            </span>
            /
            <span
              onClick={() => {
                const newKeyValues = [...keyValues];
                newKeyValues.forEach((keyValue) => (keyValue.selected = false));
                setKeyValues(newKeyValues);
              }}>
              Desmarcar todos
            </span>
          </p>
          <div id='list'>
            {pesquisa
              ? keyValues
                  ?.filter(
                    (keyValue) =>
                      _.deburr(keyValue.value.toLowerCase()).indexOf(
                        _.deburr(pesquisa.toLowerCase())
                      ) >= 0
                  )
                  .sort(sortSelectedKeyValues)
                  .map(mapKeyValues)
              : keyValues?.sort(sortSelectedKeyValues).map(mapKeyValues)}
          </div>
          <p id='selected'>{selecionados} opções marcadas</p>
          <button
            onClick={() =>
              props.close(
                keyValues
                  .filter((keyValue) => !!keyValue.selected)
                  .map((keyValue) => keyValue.key)
              )
            }>
            {props.buttonTitle}
          </button>
        </div>
      </div>
    </Backdrop>
  );
};

export default ModalKeyValue;
