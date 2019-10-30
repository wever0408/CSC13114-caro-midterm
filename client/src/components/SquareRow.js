/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Square from './Square'

const nSquareToWin = 5;
const SquareRow = ({ row, winner, rowIdx, onClick }) => {
  const squareRow = row.map((square, idx) => {
    const k = `s${  idx}`;
    let win = false;
    if (winner) {
      if (winner.direction === "ToRight" &&
        idx >= winner.x && idx <= winner.x + nSquareToWin - 1 && rowIdx === winner.y) {
          win = true;
      }
      if (winner.direction === "ToDown" &&
          rowIdx >= winner.y && rowIdx <= winner.y + nSquareToWin - 1 && idx === winner.x) {
          win = true;
      }
      if (winner.direction === "ToRightDown" &&
        idx >= winner.x && idx <= winner.x + nSquareToWin - 1 && idx - winner.x === rowIdx - winner.y) {
          win = true;
      }
      if (winner.direction === "ToLeftDown" &&
        idx <= winner.x && idx >= winner.x - nSquareToWin + 1 && winner.x - idx === rowIdx - winner.y) {
          win = true;
      }
    }
    return (
      <Square win={win} value={square} onClick={() => onClick(rowIdx, idx)} key={k} />
    )
  })
  return (
    <div className="board-row">
      {squareRow}
    </div>
  )
}

SquareRow.propTypes = {
  row: PropTypes.array.isRequired,
  winner: PropTypes.object,
  rowIdx: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SquareRow
