import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from './Canvas';
import Chat from '../../components/Chat';
import User, { UserInfo } from '../../components/User';

const Room: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const onReset = () => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const [room, setRoom] = useState<string>();
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const { roomId } = useParams<{ roomId: string }>();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    fetch(`${api}/api/gameRoom/${roomId}`)
      .then(res => res.json())
      .then(result => {
        setRoom(result.gameRoomInfo);
        setUserInfo(result.gameRoomInfo.users);
      });

    // 소켓 연결
    const newSocket = io(`${api}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  //사용자 목록 업데이트
  useEffect(() => {
    if (socket) {
      socket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
        // 새로운 배열을 생성하여 React의 조화를 트리거
        setUserInfo([...updatedUserInfo]);
        console.log('User list updated성공이닭:', updatedUserInfo);
      });

      return () => {
        socket.off('userListUpdate');
      };
    }
  }, [socket]);

  return (
    <div className="page room">
      <div className="roomArea">
        <div className="roomGroup">
          <h1 className="logo">
            <a href="javascript">로고</a>
          </h1>
          <User userInfo={userInfo} socket={socket} />
        </div>
        <div className="roomGroup">
          <div className="quizArea">
            <div className="timeArea">
              <span className="time">90</span>
            </div>
            <div className="answerArea">
              <div className="answer">포</div>
              <div className="answer" />
              <div className="answer" />
              <div className="answer" />
            </div>
            <div className="btnArea">
              <button type="button" className="btn">
                포기
              </button>
            </div>
          </div>
          <div className="changeArea">
            <Canvas />
          </div>
        </div>
        <div className="roomGroup">
          <div className="settingArea">
            <button type="button" className="btn lockOpen lockClose">
              <span>잠금</span>
              <span>열림</span>
            </button>
            <button type="button" className="btn soundOPen soundClose">
              <span>사운드 켜기</span>
              <span>사운드 끄기</span>
            </button>
          </div>
          <div className="chatArea">
            <Chat socket={socket} userInfo={userInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
