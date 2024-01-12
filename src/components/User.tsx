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
  socket: any;
}
const User: React.FC<UserProps> = ({ userInfo, socket }) => {
  const name = sessionStorage.getItem('nickName');

  useEffect(() => {
    console.log('userInfo updated:', userInfo);
  }, [userInfo, userInfo.length]);

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
              <button type="button" className="btn close">
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
