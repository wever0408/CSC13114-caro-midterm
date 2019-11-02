import React, { useState, useCallback } from 'react';
import { Card } from 'antd';
import { Button, Icon, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { setErrorText, changePassword, updateUserInfo } from '../../actions/authActions';

const EditProfileCard = React.memo(({ errorText, user, onClickCancel }) => {
  const dispatch = useDispatch();

  //const [avatar, setAvatar] = useState(user.avatar);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const [email] = useState(user.email);
  const [fullName, setFullName] = useState(user.name);
  //const [avatarFile, setAvatarFile] = useState(null);

  const cancelChangePassword = useCallback(() => {
    setIsChangePassword(false);
    onClickCancel();
  }, [onClickCancel]);

  const updatePassword = () => {
    
    if (errorText !== '') dispatch(setErrorText(''));

    if (oldPassword === '' || password === '' || retypePassword === '') {
      dispatch(setErrorText('Mật khẩu không được rỗng. Vui lòng nhập lại'));
      return;
    }

    if (password !== retypePassword) {
      dispatch(setErrorText('Mật khẩu mới không khớp. Vui lòng nhập lại'));
      return;
    }

    dispatch(changePassword(password));
  };

  const changePassword = useCallback(() => {
    setIsChangePassword(true);
  }, [setIsChangePassword]);

  const updateInfo = () => {
    const formData = new FormData();
    //if (avatarFile) formData.append('file', avatarFile.originFileObj);
    formData.append('Fullname', user.name);
    formData.append('email', email);
   
    //formData.append('avatar', user.avatar);

    dispatch(updateUserInfo(formData));
  };

  return (
    <Card
      hoverable
      className="box-shadow"
      style={{ width: 250, textAlign: 'center' }}
      cover={
        <img
          className="avatar"
          alt="avatar"
          //src={avatar}
        />
      }
    >
      {isChangePassword ? (
        <>
          <p
            style={{
              width: '190px',
              textAlign: 'center',
              color: 'red',
              marginTop: '-10px'
            }}
          >
            {errorText}
          </p>

          <Input
            style={{ marginBottom: 12 }}
            className="form-group"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            type="password"
            placeholder="Mật Khẩu Cũ"
          />
          <Input
            style={{ marginBottom: 12 }}
            className="form-group"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Mật Khẩu Mới"
          />
          <Input
            style={{ marginBottom: 12 }}
            className="form-group"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={retypePassword}
            onChange={e => setRetypePassword(e.target.value)}
            type="password"
            placeholder="Nhập Lại Mật Khẩu"
          />
          <Button
            type="default"
            className="button-shadow"
            style={{ float: 'left', marginTop: '5px' }}
            onClick={cancelChangePassword}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            className="button-shadow"
            style={{ float: 'right', marginTop: '5px' }}
            onClick={updatePassword}
          >
            Cập Nhật
          </Button>
        </>
      ) : (<>
        {/* <AvatarUpload setAvatar={setAvatar} setFile={setAvatarFile}/> */}

        <Input
            style={{marginBottom: 12}}
            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
            name="username"
            type="text"
            defaultValue={user.email}
            disabled
        />
        <Input
            style={{marginBottom: 12}}
            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
            name="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Họ tên"
        />
        {/* <Input
            style={{marginBottom: 12}}
            prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        /> */}
        <Button
            type="default"
            className="button-shadow"
            style={{float: 'left', marginTop: '5px'}}
            onClick={onClickCancel}
        >
            Hủy
        </Button>
        <Button
            type="primary"
            className="button-shadow"
            style={{float: 'right', marginTop: '5px'}}
            onClick={updateInfo}
        >
            Cập Nhật
        </Button>

        <Button
            type="link"
            style={{marginTop: '10px', marginBottom: '-5px'}}
            onClick={changePassword}
        >
            Đổi Mật Khẩu ?
        </Button>
    </>)}
    </Card>
  );
});

export default EditProfileCard;
