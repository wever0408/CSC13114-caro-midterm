/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Board from '../components/Board';
import * as action from '../actions/gameActions';
import {logoutUser} from '../actions/authActions';

const nSquareToWin = 5;
function calculateWinner(squares) {
  let win;
  for (let i = 0; i < squares.length; i += 1) {
    for (let j = 0; j < squares[i].length; j += 1) {
      // Kiểm trang NSquareToWin ô liên tiếp từ ô xuất phát sang phải, xuống góc phải dưới, xuống góc trái dưới
      // Nếu có NSquareToWin - 1 cặp liên tiếp giống nhau thì thắng
      // Direction: ToRight, ToRightDown, ToDown, ToLeftDown
      // eslint-disable-next-line no-continue
      if (!squares[i][j]) continue;
      if (j <= squares[i].length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k += 1) {
          if (squares[i][j + k] !== squares[i][j + k + 1]) {
            win = false;
          }
        }
        if (win)
          return { val: squares[i][j], x: j, y: i, direction: 'ToRight' };
      }
      if (i <= squares.length - nSquareToWin) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k += 1) {
          if (squares[i + k][j] !== squares[i + k + 1][j]) {
            win = false;
          }
        }
        if (win) return { val: squares[i][j], x: j, y: i, direction: 'ToDown' };
      }
      if (
        j <= squares[i].length - nSquareToWin &&
        i <= squares.length - nSquareToWin
      ) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k += 1) {
          if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) {
            win = false;
          }
        }
        if (win)
          return { val: squares[i][j], x: j, y: i, direction: 'ToRightDown' };
      }
      if (i <= squares.length - nSquareToWin && j >= nSquareToWin - 1) {
        win = true;
        for (let k = 0; k < nSquareToWin - 1; k += 1) {
          if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {
            win = false;
          }
        }
        if (win)
          return { val: squares[i][j], x: j, y: i, direction: 'ToLeftDown' };
      }
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.sort = this.sort.bind(this);
  }

  jumpTo (step) {
    const  {actions} = this.props;
    actions.changeStep(step);
  }

  handleClick(i, j) {
    const { p_history, p_xIsNext, p_step, actions } = this.props;
    const history = p_history.slice(0, p_step + 1);
    const current = history[p_step];
    const squares = current.squares.slice();
    current.squares.map((row, idx) => {
      squares[idx] = current.squares[idx].slice();
      return true;
    });
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = p_xIsNext ? 'X' : 'O';
    actions.clickSquare(
      history.concat([
        {
          squares,
          location: { x: i, y: j }
        }
      ])
    );
  }

  sort() {
    const {actions, p_isDescending} = this.props;
    actions.sortMoves(!p_isDescending);
    const {logoutUser} = this.props;
    //e.preventDefault();
    logoutUser();
  }

  // onLogoutClick (e) {
  //   const {logoutUser} = this.props;
  //   e.preventDefault();
  //   logoutUser();
  // }

  render() {
    const { p_history, p_isDescending, p_xIsNext, p_step } = this.props;
    const history = p_history;
    const current = history[p_step];
    const winner = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move} (${step.location.x},${step.location.y})`
        : 'Go to game start';
      return p_step === move ? (
        <li key={move}>
          <button
            type="button"
            className="btn-bold"
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      ) : (
        <li key={move}>
          <button type="button" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    if (!p_isDescending) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = `Winner: ${winner.val}`;
    } else {
      status = `Next player: ${p_xIsNext ? 'X' : 'O'}`;
    }

    const arrow = p_isDescending ? '↓' : '↑';
    return (
      <div className="content">
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i, j) => this.handleClick(i, j)}
              winner={winner}
            />
          </div>
          <div className="game-info">
            <div>
              <button type="button" onClick={this.sort}>
                Thứ tự bước {arrow}
              </button>
              <button
              type="button"
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              //onClick={this.onLogoutClick.bind(this)}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
            </div>
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  p_history: state.history,
  p_step: state.step,
  p_xIsNext: state.xIsNext,
  p_isDescending: state.isDescending
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(action,dispatch),
    //logoutUser:() => dispatch(logoutUser())
    
  };
};

const GameStart = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameStart;
