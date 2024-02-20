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
  isRound: number;
  setIsRound: React.Dispatch<React.SetStateAction<number>>;
  answer: string;
  isPencil: boolean;
}

const Chat: React.FC<UserProps> = ({
  socket,
  roomId,
  isRound,
  setIsRound,
  answer,
  isPencil,
}) => {
  const [message, setMessage] = useState<string>('');
  const username = sessionStorage.getItem('nickName');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = useCallback(() => {
    if (socket && message.trim() !== '') {
      const data = { message, username, roomId };
      socket.emit('message', data);
      if (answer && message === answer && !isPencil) {
        const answerMessage = '정답';
        socket.emit('message', { message: answerMessage });
        socket.emit('point', { username: username, roomId: roomId });
      }
      setMessage('');
    }
  }, [socket, message, username, roomId, answer, isPencil]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        if (message.trim() !== '') {
          sendMessage();
        }
        e.preventDefault();
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
          <div className="chatTop">
            {messages.find(msg => msg.message === 'start') && (
              <>
                <p>게임시작</p>
                <p>{isRound ? `${isRound}라운드 입니다.` : ''}</p>
              </>
            )}
          </div>
          <div className="chatBox" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <p key={index}>
                {msg.username
                  ? `${msg.username}님 : ${msg.message}`
                  : msg.message}
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
