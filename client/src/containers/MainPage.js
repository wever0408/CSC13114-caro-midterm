import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Button } from 'antd';
import ReactCardFlip from 'react-card-flip';
import 'antd/dist/antd.css';
import { Redirect, withRouter } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { logoutUser } from '../actions/authActions';
import ProfileCard from '../components/MainPage/ProfileCard';
import EditProfileCard from '../components/MainPage/EditProfileCard';

function MainPage(props) {
  const [flip, setFlip] = useState(false);

  const toggleFlip = useCallback(() => {
    setFlip(curr => !curr);
  }, []);
  const history = useHistory();
  return (
    <Row type="flex" align="middle" justify="center" className="all-centered">
      <Col>
        <ReactCardFlip isFlipped={flip}>
          <ProfileCard
            key="front"
            user={props.user}
            onClickEdit={toggleFlip}
          />

          <EditProfileCard
            key="back"
            errorText={props.errorText}
            user={props.user}
            onClickCancel={toggleFlip}
          />
        </ReactCardFlip>
      </Col>

      <Col style={{ margin: 'auto 50px', width: '200px' }}>
        <Button
          style={{
            display: 'block',
            background: '#5cb85c',
            border: '0.1px solid #5cb85c'
          }}
          type="primary"
          size="large"
          block
          className="horizontal-center button-shadow"
          onClick={() => history.push('/game')}
        >
          Chơi Online
        </Button>

        <Button
          style={{ display: 'block', marginTop: '20px' }}
          type="primary"
          htmlType="button"
          size="large"
          block
          className="horizontal-center button-shadow"
          onClick={() => history.push('/game')}
        >
          Chơi Với Máy
        </Button>

        <Button
          style={{ display: 'block', marginTop: '20px' }}
          type="info"
          size="large"
          block
          htmlType="button"
          className="horizontal-center button-shadow"
          onClick={props.logoutUser}
        >
          Đăng Xuất
        </Button>
      </Col>
    </Row>
  );
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    errorText: state.auth.errorText,
  };
}
 
function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainPage)
);
