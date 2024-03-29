import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import User, { UserInfo } from '../../components/User';
import Sound from '../../components/Sound';
import Start from '../../components/Start';
import Result from '../../components/Result';

interface settingProps {
  time: number;
  max_players: number;
  round: number;
}

const Room: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const { roomId } = useParams<{ roomId?: string }>() ?? { roomId: '' };
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();

  const nickName = sessionStorage.getItem('nickName');
  const character = sessionStorage.getItem('character');
  const [roomSetting, setRoomSetting] = useState<settingProps>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [isPencil, setIsPencil] = useState(false);
  const [count, setCount] = useState(0);
  const [isRound, setIsRound] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState(1);

  // 유저 목록 불러오기
  const getUser = useCallback(async () => {
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
  }, [api, roomId]);

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
      },
    });
    setSocket(newSocket);
    console.log('연결성공');

    newSocket.on('roomSetting', (setting: any) => {
      setRoomSetting(setting[0]);
    });
    newSocket.emit('setUserInfo', { userNickname: nickName });

    // 사용자 목록 업데이트
    newSocket.emit('newUserJoined', { roomId: Number(roomId) });
    newSocket.on('userListUpdate', () => {
      getUser();
    });

    // 연결 해제 시 처리
    newSocket.on('disconnect', () => {
      console.log('소켓이 연결 해제되었습니다.');
      navigate('/');
      sessionStorage.clear();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, api, character, navigate, nickName, getUser]);

  // 단어 불러오기
  const [answer, setAnswer] = useState('');
  const getAnswer = useCallback(() => {
    fetch(`${api}/api/answer/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then(res => res.json())
      .then(data => {
        setAnswer(data.answer);
        socket.emit('answer', { answer: data.answer, roomId: roomId });
      })
      .catch(error => {
        console.error(error);
      });
  }, [api, roomId, setAnswer, socket]);

  const [timer, setTimer] = useState(roomSetting?.time ?? 0);

  const [start, setStart] = useState(false);

  // 게임 시작 (방장)
  const handleStart = () => {
    socket.emit('gameStart');
    socket.emit('pencil', { isRound: currentRound, roomId: roomId });
    setStart(true);
  };

  // pencil currentRound 업데이트
  useEffect(() => {
    if (socket) {
      const handleCurrentRound = (data: number) => {
        setCurrentRound(data);
      };
      socket.on('pencil', (data: number) => {
        handleCurrentRound(data);
      });

      return () => {
        socket.off('pencil', handleCurrentRound);
      };
    }
  }, [socket, currentRound]);

  // 게임시작 업데이트
  useEffect(() => {
    if (socket) {
      const handleCurrentRound = (data: number) => {
        setCurrentRound(data);
      };
      socket.on('pencil', (data: number) => {
        handleCurrentRound(data);
      });

      return () => {
        socket.off('pencil', handleCurrentRound);
      };
    }
  }, [socket, currentRound]);

  // 타이머 함수
  const interval = useRef<any>(null);
  const countDown = () => {
    if (roomSetting) {
      interval.current = setInterval(() => {
        setTimer(prevTimer => {
          if (typeof prevTimer === 'number') {
            const newTimer = prevTimer - 1;
            // 타이머 종료시 시간 리셋
            if (newTimer <= 0) {
              socket.emit('pencil', {
                isRound: currentRound + 1,
                roomId: roomId,
              });
              clearInterval(interval.current);
              return roomSetting?.time;
            }
            socket.emit('remainTimer', {
              remainTime: newTimer,
              roomId: Number(roomId),
            });
            return newTimer;
          }
          return prevTimer;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (socket) {
      const handlePencilUpdate = async () => {
        await getUser();
      };

      socket.on('pencilUpdate', handlePencilUpdate);

      return () => {
        socket.off('pencilUpdate', handlePencilUpdate);
      };
    }
  }, [socket, getUser, isRound, roomId, userInfo, nickName]);

  // 연필 구별
  useEffect(() => {
    const pencilUser = userInfo.find(user => user.pencilAdmin === 1);
    if (pencilUser?.username === nickName) {
      setIsPencil(true);
    } else {
      setIsPencil(false);
    }
  }, [nickName, userInfo]);

  useEffect(() => {
    if (socket) {
      const handleIsRound = (data: number) => {
        setIsRound(data);
      };
      socket.on('isRound', (data: number) => {
        handleIsRound(data);
      });

      return () => {
        socket.off('isRound', handleIsRound);
      };
    }
  }, [socket, setIsRound, isRound]);

  // 다음 라운드 진행 (연필)
  const handleNextRound = () => {
    socket.emit('isRound', { isRound: isRound, roomId: Number(roomId) });
  };

  useEffect(() => {
    if (isPencil) {
      handleNextRound();
    }
  }, [isPencil]);

  // 타이머 실행
  useEffect(() => {
    if (isPencil && !gameEnd) {
      countDown();
    } else {
      clearInterval(interval.current); // isPencil이 false인 경우 타이머 중지
    }
  }, [isPencil, gameEnd]);

  // 정답시 타이머 정지
  useEffect(() => {
    if (socket) {
      const handleMessage = () => {
        if (isPencil) {
          setTimer(0);
        }
      };

      socket.on('nextRound', handleMessage);

      return () => {
        socket.off('nextRound', handleMessage);
      };
    }
  }, [socket, isPencil]);

  // 해당 라운드 정답 가져오기 (문제 맞추는 사람)
  useEffect(() => {
    if (socket && !isPencil) {
      const handleAnswer = ({ answer }: { answer: string }) => {
        setAnswer(answer);
      };

      socket.on('answer', handleAnswer);

      return () => {
        socket.off('answer', handleAnswer);
      };
    }
  }, [socket, isPencil]);

  //다음 라운드 진행 (연필)
  useEffect(() => {
    if (socket && roomSetting && isPencil && !gameEnd) {
      const isRoundListener = () => {
        getAnswer();
      };
      socket.on('isRound', isRoundListener);

      return () => {
        socket.off('isRound', isRoundListener);
      };
    }
  }, [socket, gameEnd, roomSetting, isPencil, getAnswer]);

  // 방 설정에 따라 타이머 변경
  useEffect(() => {
    if (roomSetting?.time !== undefined) {
      setTimer(roomSetting.time);
    }
  }, [roomSetting]);

  // 남은 시간
  useEffect(() => {
    if (socket) {
      const handleUpdateTimer = (timerValue: number) => {
        setCount(timerValue);
      };
      socket.on('updateTimer', handleUpdateTimer);

      return () => {
        socket.off('updateTimer', handleUpdateTimer);
      };
    }
  }, [socket, count]);

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
    if (adminUser?.username === nickName) {
      setIsAdmin(true);
    }
  }, [nickName, userInfo]);

  // 게임 종료 확인
  useEffect(() => {
    const gameEndCheck = () => {
      if (isPencil && isRound === roomSetting?.round && timer === 0) {
        socket?.emit('gameEnd', { roomId: roomId });
      }
    };

    gameEndCheck();
  }, [socket, roomId, timer, isRound, roomSetting?.round, gameEnd, isPencil]);

  useEffect(() => {
    if (socket) {
      const handleGameEnd = () => {
        setStart(false);
        setGameEnd(true);
        setAnswer('');
      };
      socket.on('gameEnd', handleGameEnd);

      return () => {
        socket.off('gameEnd', handleGameEnd);
      };
    }
  });

  // 기권 (연필)
  const handlePass = () => {
    if (isPencil) {
      setTimer(0);
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
            roomId={roomId!}
            userInfo={userInfo}
            socket={socket}
            setUserInfo={
              setUserInfo as React.Dispatch<React.SetStateAction<UserInfo[]>>
            }
            isRound={isRound}
            isAdminUser={isAdmin}
            nickName={nickName}
            isPencilUser={isPencil}
          />
        </div>
        <div className="roomGroup">
          <div className="quizArea">
            <div className="timeArea">
              {count ? (
                <span className="time">{String(count)}</span>
              ) : (
                <span className="time">0</span>
              )}
            </div>
            {answer &&
              (isPencil ? (
                <div className="answerArea">
                  {answer.split('').map((letter, letterIndex) => (
                    <div className="answer" key={letterIndex}>
                      {letter}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="answerArea">
                  {answer.split('').map((letter, letterIndex) => {
                    let className =
                      (letterIndex === 0 &&
                        roomSetting?.time &&
                        Number(timer) < roomSetting.time / 2) ||
                      Number(timer) === 0
                        ? 'answer'
                        : 'answer hidden';
                    return (
                      <div className={className} key={letterIndex}>
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}

            <div className="btnArea">
              {isPencil && (
                <button type="button" className="btn" onClick={handlePass}>
                  포기
                </button>
              )}
            </div>
          </div>
          <div className="changeArea">
            {isAdmin && !start && (
              <div className="startArea">
                <Start handleStart={handleStart} />
              </div>
            )}
            <Canvas
              socket={socket}
              roomId={roomId!}
              isPencil={isPencil}
              isRound={isRound}
            />
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
              answer={answer}
              isPencil={isPencil}
            />
          </div>
        </div>
        {gameEnd && <Result userInfo={userInfo} />}
      </div>
    </div>
  );
};

export default Room;
