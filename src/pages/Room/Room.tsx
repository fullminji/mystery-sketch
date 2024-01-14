import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import User, { UserInfo } from '../../components/User';

const Room: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const { roomId } = useParams<{ roomId?: string }>() ?? { roomId: '' };
  const [socket, setSocket] = useState<any>(null);

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

  useEffect(() => {
    getUser();

    //소켓 연결
    const newSocket = io(`${api}`, {
      query: {
        roomId,
        users_id:
          userInfo.length > 0 ? userInfo[userInfo.length - 1].users_id : null,
      },
    });
    setSocket(newSocket);
    console.log('연결성공');

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

  //사용자 목록 업데이트
  useEffect(() => {
    if (socket) {
      socket.emit('newUserJoined', { roomId: Number(roomId) }); // 새로운 유저가 방에 들어왔다고 서버에 알림
      socket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
        setUserInfo(updatedUserInfo);
        console.log('User list updated성공이닭:', updatedUserInfo);
        getUser();
      });

      return () => {
        socket.off('userListUpdate');
      };
    }
  }, [socket, roomId]);

  return (
    <div className="page room">
      <div className="roomArea">
        <div className="roomGroup">
          <h1 className="logo">
            <a href="javascript">로고</a>
          </h1>
          <User
            roomId={roomId!}
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
            <Chat socket={socket} userInfo={userInfo} roomId={roomId!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
