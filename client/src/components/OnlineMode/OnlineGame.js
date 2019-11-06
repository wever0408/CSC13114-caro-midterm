import React from 'react';
import '../../index.css';
import { Button, Col, Row } from 'antd';
import { isBoardFull } from '../../utils/gameCheckUtil';
import Board from './Board';
//import TabsWrapper from '../game/TabsWrapper';
import { BASE_COL, BASE_ROW } from '../../utils/constants';
import { ModalGameEnded } from './Modals';
import { ModalConfirm } from './Modals';

class OnlineGame extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClickSquare = this.handleOnClickSquare.bind(this);
    this.getStatus = this.getStatus.bind(this);
  }

  getStatus() {
    const turn = this.props.isMyTurn ? 'Lượt của bạn' : 'Lượt của đối thủ';

    let text = <p className="game-info">{turn}</p>;

    if (this.props.win) {
      if (this.props.winPlayer === this.props.mySymbol) {
        text = (
          <p className="game-info" style={{ color: 'red' }}>
            Bạn Đã Thắng
          </p>
        );
      } else {
        text = (
          <p className="game-info" style={{ color: 'red' }}>
            Bạn Đã Thua
          </p>
        );
      }
    } else if (isBoardFull(this.props.totalChecked)) {
      text = <p className="game-info">Hoà !</p>;
    }
    return text;
  }

  handleOnClickSquare(i, j) {
    if (this.props.win || isBoardFull(this.props.totalChecked)) {
      ModalGameEnded();
      return;
    }

    if (this.props.squares[i][j] != null || !this.props.isMyTurn) {
      return;
    }

    this.props.onClickSquare(i, j);
  }

  render() {
    return (
      <div className="container">
        <Row type="flex" justify="start">
          <Col span={4}>
            <Button
              style={{ width: 'fit-content', fontWeight: 'bold' }}
              type="primary"
              icon="caret-left"
              onClick={this.props.leaveRoom}
            >
              Thoát
            </Button>
          </Col>
          <Col>
            <b>Mã phòng:</b> {this.props.roomID}
            <br/>
            <b>Đối thủ:</b> {this.props.otherPlayer.name}
          </Col>
        </Row>

        <Row type="flex" justify="start">
          <Col>
            <div className="game-board">
              <Board
                row={BASE_ROW}
                column={BASE_COL}
                squares={this.props.squares}
                handleOnClickSquare={this.handleOnClickSquare}
              />
            </div>
          </Col>
          <Col offset={3}  >
            <div className="game-info-section">
              {this.getStatus()}

              <Row
                type="flex"
                justify="space-between"
                style={{
                  margin: 'auto 50px'
                }}
              >
                <Col span={7}>
                  <Button
                    type="primary"
                    className="button-shadow button-online"
                    style={{ textAlign: 'center' }}
                    block
                    onClick={() =>
                      ModalConfirm(
                        'Bạn xác nhận muốn xin đi lại ?',
                        this.props.handleOnRequestUndo
                      )
                    }
                  >
                    Undo req
                  </Button>
                </Col>
                <Col span={7}>
                  <Button
                    type="default"
                    className="button-shadow button-online"
                    style={{ textAlign: 'center' }}
                    block
                    onClick={() =>
                      ModalConfirm(
                        'Bạn xác nhận muốn xin hòa ?',
                        this.props.handleOnRequestDraw
                      )
                    }
                  >
                    Draw req
                  </Button>
                </Col>
                <Col span={7}>
                  <Button
                    type="danger"
                    className="button-shadow button-online"
                    style={{ textAlign: 'center' }}
                    block
                    onClick={() =>
                      ModalConfirm(
                        'Bạn xác nhận muốn đầu hàng ?',
                        this.props.handleOnRequestSurrender
                      )
                    }
                  >
                    Surrender
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default OnlineGame;
