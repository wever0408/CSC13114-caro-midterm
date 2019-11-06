import { withRouter } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Modal } from 'antd';
import OnlineGame from '../components/OnlineMode/OnlineGame';
import FindingPlayer from '../components/OnlineMode/FindingPlayer';

import {
  joinNewGame,
  leaveRoom,
  onGameDraw,
  onGameEnded,
  onNewMessage,
  onNewTurnPlayed
} from '../actions/onlineActions';
import {
  ModalConfirmAction,
  ModalGameEnded,
  ModalOutRoom,
  ModalRejected,
  ModalWaiting,
  ModalWin
} from '../components/OnlineMode/Modals';
import { highlight, isBoardFull } from '../utils/gameCheckUtil';

class OnlineGameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      findingPlayer: true
    };

    this.socket = io(process.env.REACT_APP_BACKEND_URL);

    this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
    this.handleOnClickSquare = this.handleOnClickSquare.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleOnRequestUndo = this.handleOnRequestUndo.bind(this);
    this.handleOnRequestDraw = this.handleOnRequestDraw.bind(this);
    this.handleOnRequestSurrender = this.handleOnRequestSurrender.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.socket.emit('findPlayer', this.props.user);
    } else {
      this.props.history.push('/login');
      return;
    }

    this.socket.on('newGame', room => {
      this.props.joinNewGame(room);

      this.setState({
        findingPlayer: false
      });
    });

    this.socket.on('kickRoom', () => {
      ModalOutRoom(this.handleLeaveRoom);
    });

    this.socket.on('newTurn', data => {
      if (data.win) {
        highlight(data.winArray, data.winPlayer);
      }
      this.props.onNewTurnPlayed(data);
    });

    this.socket.on('resetTurn', data => {
      Modal.destroyAll();
      this.props.onNewTurnPlayed(data);
    });

    this.socket.on('newMessage', data => {
      this.props.onNewMessage(data);
    });

    this.socket.on('otherPlayerSurrender', () => {
      ModalWin();
    });

    this.socket.on('gameEnded', data => {
      this.props.onGameEnded(data);
    });

    this.socket.on('otherPlayerRequestUndo', () => {
      ModalConfirmAction(
        'Đối Thủ Muốn Xin Đi Lại',
        () => {
          this.socket.emit('replyUndoRequest', {
            roomID: this.props.roomID,
            isPlayer1: this.props.isPlayer1,
            answer: true
          });
        },
        () => {
          this.socket.emit('replyUndoRequest', {
            roomID: this.props.roomID,
            answer: false
          });
        }
      );
    });

    this.socket.on('otherPlayerRequestDraw', () => {
      ModalConfirmAction(
        'Đối Thủ Muốn Xin Hòa',
        () => {
          this.socket.emit('replyDrawRequest', {
            roomID: this.props.roomID,
            answer: true
          });
        },
        () => {
          this.socket.emit('replyDrawRequest', {
            roomID: this.props.roomID,
            answer: false
          });
        }
      );
    });

    this.socket.on('requestRejected', () => {
      Modal.destroyAll();
      ModalRejected();
    });

    this.socket.on('gameDraw', data => {
      Modal.destroyAll();
      this.props.onGameDraw(data);
    });
  }

  componentWillUnmount() {
    this.socket.emit('leaveRoomUnmount', this.props.roomID);
    this.props.leaveRoom();

    this.socket.close();
  }

  handleLeaveRoom() {
    this.socket.emit('leaveRoom', this.props.roomID);

    this.props.history.push('/');
    this.props.leaveRoom();
  }

  handleOnClickSquare(i, j) {
    this.socket.emit('playTurn', {
      roomID: this.props.roomID,
      isPlayer1: this.props.isPlayer1,
      i,
      j
    });
  }

  handleSendMessage(message) {
    this.socket.emit('sendMessage', {
      roomID: this.props.roomID,
      username: this.props.user.username,
      message,
      timestamp: new Date().getTime()
    });
  }

  handleOnRequestUndo() {
    if (this.props.win || isBoardFull(this.props.totalChecked)) {
      ModalGameEnded();
      return;
    }

    if (this.props.totalChecked === 0) return;

    ModalWaiting();
    this.socket.emit('requestUndo', {
      roomID: this.props.roomID
    });
  }

  handleOnRequestDraw() {
    if (this.props.win || isBoardFull(this.props.totalChecked)) {
      ModalGameEnded();
      return;
    }

    ModalWaiting();
    this.socket.emit('requestDraw', {
      roomID: this.props.roomID
    });
  }

  handleOnRequestSurrender() {
    if (this.props.win || isBoardFull(this.props.totalChecked)) {
      ModalGameEnded();
      return;
    }

    this.socket.emit('requestSurrender', {
      roomID: this.props.roomID,
      isPlayer1: this.props.isPlayer1
    });
  }

  render() {
    const { findingPlayer } = this.state;

    if (findingPlayer)
    return <FindingPlayer/>;

    return (
      <OnlineGame
        {...this.props}
        handleOnRequestUndo={this.handleOnRequestUndo}
        handleOnRequestDraw={this.handleOnRequestDraw}
        handleOnRequestSurrender={this.handleOnRequestSurrender}
        sendMessage={this.handleSendMessage}
        onClickSquare={this.handleOnClickSquare}
        leaveRoom={this.handleLeaveRoom}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,

    // online
    isMyTurn: state.online.isMyTurn,
    roomID: state.online.roomID,
    isPlayer1: state.online.isPlayer1,
    squares: state.online.squares,
    totalChecked: state.online.totalChecked,
    win: state.online.win,
    winPlayer: state.online.winPlayer,
    mySymbol: state.online.mySymbol,
    otherPlayer: state.online.otherPlayer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // online
    joinNewGame: room => dispatch(joinNewGame(room)),
    leaveRoom: () => dispatch(leaveRoom()),
    onNewTurnPlayed: data => dispatch(onNewTurnPlayed(data)),
    onNewMessage: data => dispatch(onNewMessage(data)),
    onGameEnded: data => dispatch(onGameEnded(data)),
    onGameDraw: data => dispatch(onGameDraw(data))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OnlineGameContainer)
);
