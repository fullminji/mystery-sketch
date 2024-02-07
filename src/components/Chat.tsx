import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserInfo } from '../components/User';
import SendButton from '../style/images/icon/send_button.svg';

type Message = {
  message: string;
  username: string;
};
interface UserProps {
  userInfo: UserInfo[];
  socket: any;
  roomId: string;
}

const Chat: React.FC<UserProps> = ({ userInfo, socket, roomId }) => {
  const [message, setMessage] = useState<string>('');
  const username = sessionStorage.getItem('nickName');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const messageHandler = useCallback((data: Message) => {
    setMessages(prevMessages => [...prevMessages, data]);
  }, []);

  const systemMessageHandler = useCallback((data: Message) => {
    setMessages(prevMessages => [...prevMessages, data]);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', messageHandler);
      socket.on('systemMessage', systemMessageHandler);

      return () => {
        socket.off('message', messageHandler);
        socket.off('systemMessage', systemMessageHandler);
      };
    }
  }, [socket, messageHandler, systemMessageHandler]);

  const sendMessage = useCallback(() => {
    if (socket && message.trim() !== '') {
      const data = { message, username, roomId };
      socket.emit('message', data);
      setMessage('');
    }
  }, [socket, message, username]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (message.trim() !== '') {
        sendMessage();
      }
    }
  };

  //스크롤 감지
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat">
      <div className="chatContainer">
        <div className="messages">
          <div className="chatBox" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <p key={index}>
                {msg.username}님 : {msg.message}
              </p>
            ))}
          </div>
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
              onKeyUp={handleKeyUp}
            />
            <img onClick={sendMessage} src={SendButton} alt="SendButton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
