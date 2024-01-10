import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import SendButton from '../style/images/icon/send_button.svg';

type Message = {
  message: string;
  nickname: any;
};

const Chat: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const [message, setMessage] = useState<string>('');
  const [nickname, setNickname] = useState<any>('햇살');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);

  //유저정보 불러올 get API fetch
  // const getUserInfo = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${api}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //     });

  //     if (response.ok) {
  //       const userInfo = await response.json();
  //       setNickname(userInfo.nickname);
  //       // 입장 메시지를 보내는 코드 추가
  //       if (socket) {
  //         const enterMessage = `<p>${userInfo.nickname}님이 입장하셨습니다!</p>`;
  //         socket.emit('message', {
  //           message: enterMessage,
  //           nickname: userInfo.nickname,
  //         });
  //       }
  //     } else {
  //       console.error('Failed to fetch user information');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user information:', error);
  //   }
  // }, [socket]);

  //소켓 연결
  useEffect(() => {
    const newSocket = io(`${api}`);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   getUserInfo();
  // }, [getUserInfo]);

  const sendMessage = useCallback(() => {
    if (socket && message.trim() !== '') {
      const data = { message, nickname };
      socket.emit('message', data);
      setMessage('');
    }
  }, [socket, message, nickname]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      sendMessage();
    }
  };

  const messageHandler = useCallback((data: Message) => {
    setMessages(prevMessages => [...prevMessages, data]);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', messageHandler);

      return () => {
        socket.off('message', messageHandler);
      };
    }
  }, [socket, messageHandler]);

  console.log(messages);
  return (
    <div className="chat">
      <div className="chatContainer">
        <div className="chatBox">
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
              onKeyDown={handleKeyDown}
            />
            <img onClick={sendMessage} src={SendButton} alt="SendButton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
