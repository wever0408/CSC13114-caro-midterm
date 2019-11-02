import React from 'react';
import {Card, Icon} from "antd";

const {Meta} = Card;

const ProfileCard = React.memo(({user, onClickEdit}) => {

    const title = (
        <span style={{
            fontWeight: 'bold',
            display: 'block',
            wordWrap: 'break-word',
            whiteSpace: 'normal'
        }} >
            {user.name}
        </span>);

    const description = (
        <span style={{
            display: 'block',
            wordWrap: 'break-word',
            whiteSpace: 'normal'
        }} >
            {user.email}
        </span>);

    return (<Card hoverable
                  className="box-shadow"
                  style={{width: 250, textAlign: 'center'}}
                  cover={
                      <img className="avatar"
                           alt="avatar"
                           //src={user.avatar}
                      />
                  }
                  actions={[
                        <span onClick={onClickEdit}
                            style={{fontSize: '16px'}}>
                              <Icon style={{marginRight: '10px'}}
                                    type="edit" key="edit"/>
                              Cập nhật thông tin
                        </span>
                  ]}>
        <Meta
            title={title}
            description={description}
        />
    </Card>)
});

export default ProfileCard;