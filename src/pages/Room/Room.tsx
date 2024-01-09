import React from 'react';
import Canvas from './Canvas';
import Chat from '../../components/Chat';
import char from '../../style/images/visual/char.png';

const Room: React.FC = () => {
  const onReset = () => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="page room">
      <div className="roomArea">
        <div className="roomTop">
          <h1 className="logo">
            <a href="javascript">로고</a>
          </h1>
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
        </div>
        <div className="roomBottom">
          <ul className="userArea">
            <li className="me">
              <div className="user">
                <div className="userInfo">
                  <span className="nickName me">닉네임하세요&#40;YOU&#41;</span>
                  <span className="point">1000 POINT</span>
                </div>
                <div className="char crown pencil">
                  <img src={char} alt="캐릭터" />
                </div>
              </div>
              <button type="button" className="btn close">
                <span>추방</span>
              </button>
            </li>
            <li>
              <div className="user">
                <div className="userInfo">
                  <span className="nickName">닉네임하세요</span>
                  <span className="point">100 POINT</span>
                </div>
                <div className="char">
                  <img src={char} alt="캐릭터" />
                </div>
              </div>
              <button type="button" className="btn close">
                <span>추방</span>
              </button>
            </li>
            <li>
              <span className="user no">NO USER</span>
            </li>
            <li>
              <span className="user no">NO USER</span>
            </li>
            <li>
              <span className="user no">NO USER</span>
            </li>
            <li>
              <span className="user no">NO USER</span>
            </li>
            <li>
              <span className="user no">NO USER</span>
            </li>
            <li>
              <span className="user no">NO USER</span>
            </li>
          </ul>
          <div className="sketchArea">
            <div className="canvasArea">
              <Canvas />
            </div>
            <div className="pencilArea">
              <ul className="colorArea">
                <li>
                  <input
                    type="radio"
                    id="color01"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color01" className="formLabel">
                    <span>빨강</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color02"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color02" className="formLabel">
                    <span>주황</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color03"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color03" className="formLabel">
                    <span>노랑</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color04"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color04" className="formLabel">
                    <span>초록</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color05"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color05" className="formLabel">
                    <span>파랑</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color06"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color06" className="formLabel">
                    <span>남색</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color07"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color07" className="formLabel">
                    <span>보라</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color08"
                    name="colorGroup"
                    className="formRadio"
                  />
                  <label htmlFor="color08" className="formLabel">
                    <span>흰색</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="color09"
                    name="colorGroup"
                    className="formRadio"
                    checked
                  />
                  <label htmlFor="color09" className="formLabel">
                    <span>검정</span>
                  </label>
                </li>
              </ul>
              <ul className="drawArea">
                <li>
                  <input
                    type="radio"
                    id="draw01"
                    name="drawGroup"
                    className="formRadio"
                    checked
                  />
                  <label htmlFor="draw01" className="formLabel">
                    <span>연필</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="draw02"
                    name="drawGroup"
                    className="formRadio"
                  />
                  <label htmlFor="draw02" className="formLabel">
                    <span>지우개</span>
                  </label>
                </li>
                <li>
                  <button type="button" className="btn" onClick={onReset}>
                    <span>전체 지우기</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Room;
