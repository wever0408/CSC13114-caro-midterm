import React from 'react';
import Square from './Square';

const Board = ({row, column, squares, handleOnClickSquare}) => {
    return row.map((r) => (
        <div key={`r${r}`}
             className="board-row">

            {column.map((c) =>
                <Square key={`${r}_${c}`} id={`${r}_${c}`}
                        value={squares[r][c]}
                        onClick={() => handleOnClickSquare(r, c)}/>)}
        </div>));
};

export default Board;