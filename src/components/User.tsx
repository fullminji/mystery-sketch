import React, { useState, useEffect } from 'react';
interface Users {
  userId: number;
  nickname: any;
  points: number;
  profileImage: string;
}
const User: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    UserData();
  }, []);

  const UserData = async () => {
    try {
      const response = await fetch('/usermockdata.json');
      const { data }: { data: Users[] } = await response.json();
      setUsers((data || []).map(user => ({ ...user, isMe: false })));
    } catch (error) {
      console.error('유저 데이터를 불러오는 중 오류 발생', error);
    }
  };

  return (
    <div className="user">
      <ul className="userArea">
        {users.map(user => (
          <li key={user.userId}>
            <div className="users">
              <div className="userInfo">
                <span className={`nickName ${user.userId === 1 ? 'me' : ''}`}>
                  {user.nickname}
                </span>
                <span className="point">{user.points} POINT</span>
              </div>
              <div className="char crown pencil">
                <img src={user.profileImage} alt="캐릭터" />
              </div>
            </div>
            <button type="button" className="btn close">
              <span>추방</span>
            </button>
          </li>
        ))}
        {Array.from({ length: Math.max(0, 8 - users.length) }).map(
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
