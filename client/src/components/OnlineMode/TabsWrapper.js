import React from 'react';
import {Icon, Tabs} from "antd";
import OnlineMoveHistoryContainer from "../../containers/game/OnlineMoveHistoryContainer";
import ChatBox from '../chatbox/ChatBox/index';

const {TabPane} = Tabs;

const TabsWrapper = (props) => {
    return (<div style={{
        margin: '0 50px',
        textAlign: 'center',
        width: '580px'
    }}>
        <Tabs defaultActiveKey="1">
            <TabPane key="1"
                     tab={
                         <span style={{
                             fontSize: '18px',
                             fontWeight: 'bold'
                         }}>
                            <Icon type="wechat"/>
                            Trò chuyện
                         </span>
                     }>
                <ChatBox sendMessage={props.sendMessage}/>
            </TabPane>
        </Tabs>
    </div>)
};

export default TabsWrapper;