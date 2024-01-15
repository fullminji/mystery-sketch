import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import User, { UserInfo } from '../../components/User';

interface AnswerObject {
  id: number;
  answer: string;
}

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

  // 단어 불러오기
  const [answerList, setAnswerList] = useState<AnswerObject[]>([]);
  useEffect(() => {
    fetch(`${api}/api/answer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then(res => res.json())
      .then((data: AnswerObject[]) => {
        setAnswerList(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

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

  // copy
  const handleCopyToClipboard = () => {
    const nickName = sessionStorage.getItem('nickName');

    if (nickName === null) {
      navigator.clipboard.writeText(`/main/${roomId}`);
    } else {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
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
            {answerList.map((answerObj, index) => (
              <div className="answerArea" key={index}>
                {answerObj.answer.split('').map((letter, letterIndex) => (
                  <div className="answer" key={letterIndex}>
                    {letter}
                  </div>
                ))}
              </div>
            ))}
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
            <div className="btnArea">
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
            <div className="copyArea">
              <span>링크</span>
              <button
                type="button"
                className="btn"
                onClick={handleCopyToClipboard}
              >
                Copy
              </button>
            </div>
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
