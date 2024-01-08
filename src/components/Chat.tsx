import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SendButton from '../style/images/icon/send_button.svg';

type Message = {
  message: string;
  nickname: any;
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [nickname] = useState<any>(() => {
    //로컬 스토리지에서 닉네임 가져올 예정 test로 기본이름값 지정
    const userNickname = localStorage.getItem('nickname');
    return userNickname || '햇살';
  });

  const [messages, setMessages] = useState<Message[]>([]);
  //서버 주소 입력 필요
  const socket = io('http://your-socket-io-server-url');

  useEffect(() => {
    // 컴포넌트가 마운트될 때 소켓 연결
    socket.on('message', (data: Message) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });
    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    const data = { message, nickname };
    socket.emit('message', data);
    setMessage('');
  };

  console.log(message);
  return (
    <div className="chat">
      <div className="chatContainer">
        <div className="chatBox">
          {/* <p>닉네임님이 입장하셨습니다.</p>
          <p>닉네임 : 포크레인</p>
          <p>현재시간은 1:39am 눈이 감겨요</p>
          <p>짜라쟌 짝수에만 배경색</p> */}
          {messages.map((msg, index) => (
            <p key={index}>
              {msg.nickname}님 : {msg.message}
            </p>
          ))}
        </div>
        <div className="sendBox">
          <div className="send">
            <input
              type="text"
              value={message}
              placeholder="채팅을 입력해주세요"
              onChange={e => {
                setMessage(e.target.value);
              }}
            />
            <img onClick={sendMessage} src={SendButton} alt="SendButton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
