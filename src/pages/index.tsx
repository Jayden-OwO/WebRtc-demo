// import { useTranslateKeysToMaps } from 'iscommon/i18n/utils';
import type { TabsProps } from 'antd';
import { Button, Form, Input, Tabs } from 'antd';
import { useState } from 'react';
import io from 'socket.io-client';
import styles from './index.less';
// const { io } = require('socket.io-client');
interface Props {
  store?: any;
}
let socket = null;
function Index() {
  // const [socket, setSocket] = useState(null);
  const [onlineClients, setOnlineClients] = useState([]);
  const [messages, setMessage] = useState([]);
  const mediaStreamConstraints = {
    video: true,
    audio: true,
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `聊天室`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: '2',
      label: `用户(${onlineClients.length})`,
      children: `Content of Tab Pane 2`,
    },
  ];

  const joinRoom = () => {
    let url = 'http://localhost:9000';
    socket = io.connect(url, { query: { username: 1, room: 'hello' } });
    // this.socket = ;
    // 其他用户加入聊天室
    // this.socket.on('join', (data: object) => {
    //   this.updateChatMessage({ msg: data.username + '加入了聊天室', type: 'sys' });
    // });
    // 自己加入成功
    socket.on('joined', () => {
      console.log('我自己加入了');
      // this.updateChatMessage();
    });
    socket.on('ready', () => {
      console.log('准备好了');
    });
    // // 自己离开了
    socket.on('left', () => {
      socket.disconnect();
      setMessage([]);
      setOnlineClients([]);
      // this.onlineClients = [];
    });
    // // 别人离开了
    // this.socket.on('leave', (data) => {
    //   this.updateChatMessage({ msg: data.username + '离开了聊天室', type: 'sys' });
    //   if (this.biPeersList[data.userId]) {
    //     this.biPeersList[data.userId].close();
    //     delete this.biPeersList[data.userId];
    //   }
    // });

    // 监听加入人员的信息
    socket.on('clients', (data: any) => {
      console.log('clients', data);
      setOnlineClients(data);
    });

    // this.socket.on('pc message', (data) => {
    //   this.trace('客户端收到了pc的消息', data);
    //   this.signalingMessageCallback(data);
    // });
    // // 收到别人发的聊天信息
    // this.socket.on('message', (data) => {
    //   this.updateChatMessage(data);
    // });
    // // 收到别人的要求视频互动的私信
    // this.socket.on('interact', (data) => {
    //   this.$confirm(`${data.from.username}想和你视频互动，请接受`, '提示信息', {
    //     distinguishCancelAndClose: true,
    //     confirmButtonText: '接受',
    //     cancelButtonText: '拒绝',
    //   })
    //     .then(() => {
    //       // 同意和对方互动, 对方发起，自己接受
    //       this.socket.emit('agree interact', data);
    //       this.pcMsgTo = data.from;
    //       this.createPeerConnection(false, data);
    //     })
    //     .catch(() => {
    //       // 拒绝和对方互动
    //       this.socket.emit('refuse interact', data);
    //     });
    // });
    // // 对方同意了了和你视频互动，自己发起，对方接受
    // this.socket.on('agree interact', (data) => {
    //   this.$message({ type: 'success', message: `${data.to.username}接受了视频互动的请求` });
    //   this.pcMsgTo = data.to;
    //   this.trace(`${data.to.username}接受了视频互动的请求`);
    //   this.createPeerConnection(true, data);
    // });
    // // 对方拒绝了和你视频互动
    // this.socket.on('refuse interact', (data) => {
    //   this.$message({ type: 'warning', message: `${data.to.username}拒绝了视频互动的请求` });
    //   this.trace(`${data.to.username}拒绝了视频互动的请求`);
    // });
    // // 监听到对方结束互动
    // this.socket.on('stop interact', (data) => {
    //   let part = data.from;
    //   this.$message({ type: 'info', message: `${part.username}停止了和您互动，连接即将断开`, duration: 1500 });
    //   console.log('this.biPeersList', this.biPeersList);
    //   this.peerList[data.from.userId].close();
    //   this.peerList[data.from.userId] = null;
    //   let index = this.biPeersList.findIndex((v) => v.other.userId === part.userId);
    //   if (index > -1) {
    //     this.biPeersList[index].close();
    //     this.biPeersList.splice(index, 1);
    //   }
    // });
  };
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8 }}>
            <Button type="primary" htmlType="submit" onClick={joinRoom}>
              加入
            </Button>
            <Button type="primary" htmlType="submit" disabled={socket ? false : true} style={{ marginLeft: 10 }}>
              离开
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.onlineBox}>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
      {/* <div className={styles.onlineInfo}>
      </div> */}
    </div>
  );
}

export default Index;
