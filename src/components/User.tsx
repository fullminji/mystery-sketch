import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserInfo {
  score: number;
  isAdmin: number;
  username: string;
  users_id: number;
  image_link: string;
  roomId: string;
  pencilAdmin: number;
}

export interface GameRoomInfo {
  round: number;
}

interface UserProps {
  userInfo: UserInfo[];
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo[]>>; // setUserInfo를 함수 타입으로 수정
  socket: any;
  roomId: string;
  isRound: any;
  isAdminUser: boolean;
  isPencilUser: boolean;
  nickName: string | null;
}
const User: React.FC<UserProps> = ({
  userInfo,
  socket,
  setUserInfo,
  roomId,
  isRound,
  isAdminUser,
  isPencilUser,
  nickName,
}) => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem('nickName');

  // 클라이언트 측에서 유저를 추방하는 로직 추가
  const handleExpelUser = (username: string) => {
    const expulsionMessage = `${username}님이 추방되셨습니다.`;
    // 시스템 메시지를 채팅박스에 추가
    socket.emit('message', {
      message: expulsionMessage,
      type: 'expel',
    });

    // 서버에 추방 정보 전송
    socket.emit('expelUser', { username: username });
  };

  useEffect(() => {
    if (socket) {
      const handleExpelUser = ({ username }: { username: string }) => {
        if (nickName === username) {
          navigate('/');
          console.log('추방 성공');
        }
      };
      socket.on('expelUser', handleExpelUser);
      return () => {
        socket.off('expelUser', handleExpelUser);
      };
    }
  }, [socket, nickName, navigate]);

  return (
    <div className="user">
      <ul className="userArea">
        {userInfo.map(user => {
          const {
            score,
            isAdmin,
            username,
            users_id,
            image_link,
            pencilAdmin,
          } = user;
          return (
            <li key={users_id}>
              <div className="users">
                <div className="userInfo">
                  <span className={`nickName ${name === username ? 'me' : ''}`}>
                    {username}
                  </span>
                  <span className="point">{score} POINT</span>
                </div>
                <div
                  className={`char${pencilAdmin === 1 ? ' pencil' : ''}${
                    isAdmin === 1 ? ' crown' : ''
                  }`}
                >
                  <img src={image_link} alt="캐릭터" />
                </div>
              </div>
              {isAdminUser && (
                <button
                  className={`${isAdmin !== 1 ? 'btn close' : ''}`}
                  type="button"
                  onClick={() => handleExpelUser(username)}
                />
              )}
            </li>
          );
        })}
        {Array.from(
          { length: Math.max(0, 8 - userInfo.length) },
          (_, index) => (
            <li key={`empty-${index}`}>
              <span className="users no">NO USER</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default User;
