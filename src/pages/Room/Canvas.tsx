import React, { useRef, useState, useEffect } from 'react';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    const ctx = canvas?.getContext('2d');
    if (ctx !== null && ctx !== undefined) {
      ctx.strokeStyle = 'black';
      setCtx(ctx);
    }
  }, []);

  const drawFn = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      if (!painting) {
        ctx?.beginPath();
        ctx?.moveTo(mouseX, mouseY);
      } else {
        ctx?.lineTo(mouseX, mouseY);
        ctx?.stroke();
      }
    }
  };

  return (
    <div className="canvasArea">
      <canvas
        ref={canvasRef}
        onMouseMove={e => drawFn(e)}
        onMouseDown={() => setPainting(true)}
        onMouseUp={() => setPainting(false)}
        onMouseLeave={() => setPainting(false)}
      />
      <ul className="colorArea">
        <li className="color">
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
        <li className="color">
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
        <li className="color">
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
        <li className="color">
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
        <li className="color">
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
        <li className="color">
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
        <li className="color">
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
        <li className="color">
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
        <li className="color">
          <input
            type="radio"
            id="color09"
            name="colorGroup"
            className="formRadio"
          />
          <label htmlFor="color09" className="formLabel">
            <span>검정</span>
          </label>
        </li>
        <li className="draw">
          <input
            type="radio"
            id="draw01"
            name="drawGroup"
            className="formRadio"
          />
          <label htmlFor="draw01" className="formLabel">
            <span>연필</span>
          </label>
        </li>
        <li className="draw">
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
        <li className="draw">
          <button type="button" className="btn">
            <span>전체 지우기</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Canvas;
