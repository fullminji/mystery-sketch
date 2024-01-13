import React, { useEffect } from 'react';

export interface UserInfo {
  score: number;
  isAdmin: number;
  username: string;
  users_id: number;
  image_link: string;
}
interface UserProps {
  userInfo: UserInfo[];
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo[]>>; // setUserInfo를 함수 타입으로 수정
  socket: any;
}
const User: React.FC<UserProps> = ({ userInfo, socket, setUserInfo }) => {
  const name = sessionStorage.getItem('nickName');

  useEffect(() => {
    console.log('userInfo updated:', userInfo);
  }, [userInfo, userInfo.length]);

  //사용자 목록 업데이트
  // useEffect(() => {
  //   if (socket) {
  //     socket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
  //       // 새로운 배열을 생성하여 React의 조화를 트리거
  //       setUserInfo(prevUserInfo => {
  //         // 이전 상태를 사용하여 업데이트
  //         return [...prevUserInfo, ...updatedUserInfo];
  //       });
  //       console.log('User list updated성공이닭:', updatedUserInfo);
  //     });

  //     return () => {
  //       socket.off('userListUpdate');
  //     };
  //   }
  // }, [socket]);

  // 클라이언트 측에서 유저를 추방하는 로직 추가
  const handleExpelUser = (userId: number, username: string) => {
    const updatedUsers = userInfo.filter(user => user.users_id !== userId);
    setUserInfo(updatedUsers);
    const expulsionMessage = `${username}님이 추방되셨습니다.`;
    // 시스템 메시지를 채팅박스에 추가
    socket.emit('message', {
      message: expulsionMessage,
      username: '시스템',
      type: 'expel',
    });

    // 서버에 추방 정보 전송
    socket.emit('expelUser', { userId, username });
  };

  // useEffect(() => {
  //   // 다른 클라이언트로부터 추방 정보 받기
  //   socket.on(
  //     'userExpelled',
  //     ({ userId, username }: { userId: number; username: string }) => {
  //       // 화면에서 해당 유저 제거
  //       const updatedUsers = userInfo.filter(user => user.users_id !== userId);
  //       setUserInfo(updatedUsers);
  //     },
  //   );

  //   return () => {
  //     socket.off('userExpelled');
  //   };
  // }, [socket, userInfo]);

  //사용자 목록 업데이트
  // useEffect(() => {
  //   if (socket) {
  //     socket.on('userListUpdate', (updatedUserInfo: UserInfo[]) => {
  //       console.log('User list updated:', updatedUserInfo);
  //     });

  //     return () => {
  //       socket.off('userListUpdate');
  //     };
  //   }
  // }, [socket]);

  return (
    <div className="user">
      <ul className="userArea">
        {userInfo.map(user => {
          const { score, isAdmin, username, users_id, image_link } = user;

          return (
            <li key={users_id}>
              <div className="users">
                <div className="userInfo">
                  <span className={`nickName ${name === username ? 'me' : ''}`}>
                    {username}
                  </span>
                  <span className="point">{score} POINT</span>
                </div>
                <div className={`char pencil ${isAdmin === 1 ? 'crown' : ''}`}>
                  <img src={image_link} alt="캐릭터" />
                </div>
              </div>
              <button
                type="button"
                className="btn close"
                onClick={() => handleExpelUser(users_id, username)}
              >
                <span>추방</span>
              </button>
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
