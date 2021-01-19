import React, { ReactNode, useRef } from 'react';
import './Backdrop.scss';

interface Props {
  onBackdropClick: () => void;
  children?: ReactNode;
  zindex?: number;
}

const Backdrop: React.FC<Props> = (props) => {
  const backdropRef = useRef<HTMLDivElement>();
  return (
    <div
      {...(props.zindex !== undefined && props.zindex !== null
        ? { style: { zIndex: props.zindex } }
        : {})}
      ref={backdropRef}
      onClick={(event) =>
        event.target === backdropRef.current && props.onBackdropClick
          ? props.onBackdropClick()
          : null
      }
      className='Backdrop'>
      {props.children}
    </div>
  );
};

export default Backdrop;
