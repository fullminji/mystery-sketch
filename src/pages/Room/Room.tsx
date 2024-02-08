import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import User, { UserInfo, GameRoomInfo } from '../../components/User';
import Sound from '../../components/Sound';
import Start from '../../components/Start';
import Result from '../../components/Result';

interface AnswerObject {
  id: number;
  answer: string;
}

interface settingProps {
  time: number;
  max_players: number;
  round: number;
}

const Room: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [gameRoomInfo, setGameRoomInfo] = useState<GameRoomInfo[]>([]);
  const { roomId } = useParams<{ roomId?: string }>() ?? { roomId: '' };
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();

  const nickName = sessionStorage.getItem('nickName');
  const character = sessionStorage.getItem('character');
  const [roomSetting, setRoomSetting] = useState<settingProps>();

  const [isAdmin, setIsAdmin] = useState(false);

  const [gameEnd, setGameEnd] = useState(false);

  const getUser = async () => {
    try {
      const response = await fetch(`${api}/api/gameRoom/${roomId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUserInfo(result.gameRoomInfo.users);
      setGameRoomInfo(result.gameRoomInfo);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    if (!nickName || !character) {
      navigate(`/main/${roomId}`);
      return () => {};
    }
    getUser();

    //소켓 연결
    const newSocket = io(`${api}`, {
      transports: ['websocket'],
      query: {
        roomId,
        // users_id:
        //   userInfo.length > 0 ? userInfo[userInfo.length - 1].users_id : null,
      },
    });
    setSocket(newSocket);
    console.log('연결성공');

    newSocket.on('roomSetting', (setting: any) => {
      setRoomSetting(setting[0]);
    });

    // 사용자 목록 업데이트
    newSocket.emit('newUserJoined', { roomId: Number(roomId) });
    newSocket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
      setUserInfo(updatedUserInfo);
      console.log('User list updated 성공:', updatedUserInfo);
      getUser();
    });
    // 연결 해제 시 처리
    newSocket.on('disconnect', () => {
      // 여기에 소켓 연결 해제 시 수행할 작업을 추가하세요.
      // navigate('/');
      console.log('소켓이 연결 해제되었습니다.');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const [timer, setTimer] = useState(roomSetting?.time ?? 0);
  const [isRound, setIsRound] = useState<number>(1);

  const handleStart = () => {
    socket.emit('gameStart');
    handleTimer();
  };

  const handleTimer = () => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (typeof prevTimer === 'number' && roomSetting) {
          const newTimer = prevTimer - 1;
          if (newTimer < 0) {
            clearInterval(interval);
            socket.emit('isRound', {
              isRound: isRound,
              roomId: Number(roomId),
            });
            return roomSetting?.time;
          }
          socket?.emit('remainTimer', {
            remainTime: newTimer,
            roomId: Number(roomId),
          });
          return newTimer;
        }
        return prevTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (socket && roomSetting && !gameEnd) {
      const isRoundListener = () => {
        handleTimer();
      };
      socket.on('isRound', isRoundListener);

      return () => {
        socket.off('isRound', isRoundListener);
      };
    }
  }, [socket, isRound]);

  useEffect(() => {
    if (roomSetting?.time !== undefined) {
      setTimer(roomSetting.time);
    }
  }, [roomSetting]);

  // 남은 시간 (방장 제외)
  useEffect(() => {
    if (socket && !isAdmin) {
      const handleUpdateTimer = (timerValue: number) => {
        setTimer(timerValue);
      };
      socket.on('updateTimer', handleUpdateTimer);

      return () => {
        socket.off('updateTimer', handleUpdateTimer);
      };
    }
  }, [isAdmin, socket]);

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

  const answerValues = answerList.map(item => item.answer);

  // 잠금
  const [isLocked, setIsLocked] = useState(false);
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  // copy
  const handleCopyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => alert('복사완료'));
  };

  // 방장 구별
  useEffect(() => {
    const adminUser = userInfo.find(user => user.isAdmin === 1);
    if (adminUser && adminUser.username === nickName) {
      setIsAdmin(true);
    }
  }, [nickName, userInfo]);

  // 게임 진행 라운드

  const handleIsRound = () => {
    fetch(`${api}/api/gameRoom/currentRound`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        roomId: roomId,
        isRound: isRound,
      }),
    })
      .then(res => res.json())
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    handleIsRound();
    const gameEndCheck = () => {
      if (isRound === roomSetting?.round) {
        socket?.emit('gameEnd', { roomId: roomId });
        setGameEnd(true);
      }
      console.log(isRound, roomSetting?.round);
    };

    gameEndCheck();
  }, [isRound, roomSetting?.round]);

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
            gameRoomInfo={gameRoomInfo}
            setGameRoomInfo={
              setGameRoomInfo as React.Dispatch<
                React.SetStateAction<GameRoomInfo[]>
              >
            }
          />
        </div>
        <div className="roomGroup">
          <div className="quizArea">
            <div className="timeArea">
              {timer ? (
                <span className="time">{String(timer)}</span>
              ) : (
                <span className="time">0</span>
              )}
            </div>
            {answerValues[isRound - 1] && (
              <div className="answerArea">
                {answerValues[isRound - 1]
                  .split('')
                  .map((letter, letterIndex) => (
                    <div
                      className={
                        (letterIndex === 0 &&
                          roomSetting?.time &&
                          Number(timer) < roomSetting.time / 2) ||
                        Number(timer) === 0
                          ? 'answer'
                          : 'answer hidden'
                      }
                      key={letterIndex}
                    >
                      {letter}
                    </div>
                  ))}
              </div>
            )}
            <div className="btnArea">
              <button type="button" className="btn">
                포기
              </button>
            </div>
          </div>
          {/* {isAdmin && ( */}
          <div className="startArea">
            <Start handleStart={handleStart} />
          </div>
          {/* )} */}
          <div className="changeArea">
            <Canvas socket={socket} roomId={roomId!} />
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
              <Sound />
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
            <Chat
              socket={socket}
              userInfo={userInfo}
              roomId={roomId!}
              isRound={isRound}
              setIsRound={setIsRound}
            />
          </div>
        </div>
        {gameEnd && <Result />}
      </div>
    </div>
  );
};

export default Room;
