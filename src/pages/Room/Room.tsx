import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import User, { UserInfo } from '../../components/User';

const Room: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const [room, setRoom] = useState<string>();
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const { roomId } = useParams<{ roomId: string }>();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    getUser();

    // 소켓 연결
    const newSocket = io(`${api}`);
    setSocket(newSocket);
    console.log('소켓연결');

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // const getUser = () => {
  //   fetch(`${api}/api/gameRoom/${roomId}`)
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then(result => {
  //       setRoom(result.gameRoomInfo);
  //       setUserInfo(result.gameRoomInfo.users);
  //     })
  //     .catch(error => {
  //       console.error('Fetch error:', error);
  //     });
  // };

  const getUser = async () => {
    try {
      const response = await fetch(`${api}/api/gameRoom/${roomId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUserInfo(result.gameRoomInfo.users);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  //사용자 목록 업데이트
  useEffect(() => {
    if (socket) {
      socket.emit('newUserJoined', { roomId: Number(roomId) }); // 새로운 유저가 방에 들어왔다고 서버에 알림
      socket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
        setUserInfo(updatedUserInfo);
        console.log('User list updated성공이닭:', updatedUserInfo);
        getUser();
      });

      // socket.on('userListUpdate', (updatedUserInfoString: string) => {
      //   const updatedUserInfo = JSON.parse(updatedUserInfoString);
      //   const usersInfo = JSON.parse(updatedUserInfo.users);
      //   setUserInfo(usersInfo);
      //   console.log('User list updated성공이닭:', usersInfo);
      //   getUser();
      // });

      return () => {
        socket.off('userListUpdate');
      };
    }
  }, [socket, roomId]);

  // 잠금
  const [isLocked, setIsLocked] = useState(false);
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  //사운드
  const [isSound, setIsSound] = useState(true);
  const toggleSound = () => {
    setIsSound(!isSound);
  };

  return (
    <div className="page room">
      <div className="roomArea">
        <div className="roomGroup">
          <h1 className="logo">
            <a href="javascript">로고</a>
          </h1>
          <User
            userInfo={userInfo}
            socket={socket}
            setUserInfo={
              setUserInfo as React.Dispatch<React.SetStateAction<UserInfo[]>>
            }
          />
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
            <button
              type="button"
              className={`btn${isLocked ? ' lockOpen' : ' lockClose'}`}
              onClick={toggleLock}
            >
              <span>{isLocked ? '열림' : '잠금'}</span>
            </button>
            <button
              type="button"
              className={`btn${isSound ? ' soundOpen' : ' soundClose'}`}
              onClick={toggleSound}
            >
              <span>{isSound ? '사운드 켜기' : '사운드 끄기'}</span>
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
