import React from 'react';

interface UserProps {
  username: string;
  points: number;
}

const User: React.FC<UserProps> = ({ username, points }) => {
  return (
    <div className="user">
      <p>{username}</p>
      <p>{points} POINT</p>
    </div>
  );
};

const Create: React.FC = () => {
  return (
    <div className="page create">
      <div className="background">
        <div className="gameBar">
          <p className="logo">
            MYSTERY
            <br />
            SKETCH
          </p>
        </div>
        <div className="container">
          <div className="userBox">
            <User username="헝민" points={100} />
            <User username="NO USER" points={0} />
            <User username="NO USER" points={0} />
            <User username="NO USER" points={0} />
            <User username="NO USER" points={0} />
            <User username="NO USER" points={0} />
            <User username="NO USER" points={0} />
            <User username="NO USER" points={0} />
          </div>

          <div className="gameBox">
            <div className="settingBox">
              <div className="canvas">
                <div className="check">
                  <p>플레이어</p>
                  <select className="selectBox">
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                  </select>
                </div>
                <div className="check">
                  <p>그리는 시간</p>
                  <select className="selectBox">
                    <option>60초</option>
                    <option>80초</option>
                    <option>100초</option>
                  </select>
                </div>
                <div className="check">
                  <p>라운드</p>
                  <select className="selectBox">
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                </div>
                <button>START</button>
              </div>
              <div className="linkCopyBtn">
                <span>링크</span>
                <span className="linkBtn">Copy</span>
              </div>
            </div>
            <div className="chatroom" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
