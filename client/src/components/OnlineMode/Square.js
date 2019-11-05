import React from 'react';
import '../../index.css';

const Square = React.memo(({id, value, onClick}) => {
    const textColor = value === 'X' ? 'blue' : 'red';
    return (
        <button type="button" className="square" id={id} onClick={onClick}>
            <span style={{
                color: textColor
            }}>
                {value}
            </span>
        </button>
    );
}, (prevProps, nextProps) => {
    return (prevProps.id === nextProps.id && prevProps.value === nextProps.value);
});

export default Square;