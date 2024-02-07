import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserInfo {
  score: number;
  isAdmin: number;
  username: string;
  users_id: number;
  image_link: string;
  roomId: string;
}

export interface GameRoomInfo {
  round: number;
}

interface UserProps {
  userInfo: UserInfo[];
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo[]>>; // setUserInfo를 함수 타입으로 수정
  socket: any;
  roomId: string;
  gameRoomInfo: GameRoomInfo[];
  setGameRoomInfo: React.Dispatch<React.SetStateAction<GameRoomInfo[]>>;
}
const User: React.FC<UserProps> = ({
  userInfo,
  socket,
  setUserInfo,
  roomId,
  gameRoomInfo,
  setGameRoomInfo,
}) => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem('nickName');

  useEffect(() => {
    console.log('userInfo updated:', userInfo);

    // console.log('test: ', gameRoomInfo);
  }, [userInfo, userInfo.length]);

  // 클라이언트 측에서 유저를 추방하는 로직 추가
  const handleExpelUser = (users_id: number, username: string) => {
    const updatedUsers = userInfo.filter(user => user.users_id !== users_id);
    setUserInfo(updatedUsers);
    const expulsionMessage = `${username}님이 추방되셨습니다.`;
    // 시스템 메시지를 채팅박스에 추가
    socket.emit('message', {
      message: expulsionMessage,
      username: '관리자',
      type: 'expel',
    });

    // 서버에 추방 정보 전송
    socket.emit('expelUser', { users_id, roomId });

    socket.on('userExpelled', (expelledUserId: number) => {
      if (users_id === expelledUserId) {
        navigate('/');
        console.log('추방 성공');
      }
    });

    console.log('추방유저 ID :', users_id, username);
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
  //       setUserInfo(updatedUserInfo);
  //       console.log(updatedUserInfo);
  //     });

  //     return () => {
  //       socket.off('userListUpdate');
  //     };
  //   }
  // }, [socket]);

  return (
    <div className="user">
      <ul className="userArea">
        {userInfo.map((user, index) => {
          const { score, isAdmin, username, users_id, image_link } = user;
          const isPencil = index === gameRoomInfo[0]?.round;
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
                  className={`char${isPencil ? ' pencil' : ''}${
                    isAdmin === 1 ? ' crown' : ''
                  }`}
                >
                  <img src={image_link} alt="캐릭터" />
                </div>
              </div>
              {isAdmin !== 1 && (
                <button
                  className={`${isAdmin !== 1 ? 'btn close' : ''}`}
                  type="button"
                  onClick={() => handleExpelUser(users_id, username)}
                />
              )}
            </li>
          );
        })}
        {Array.from({ length: Math.max(0, 8 - userInfo.length) }).map(
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
