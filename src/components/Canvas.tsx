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
      ctx.lineWidth = 3;
      setCtx(ctx);
    }
  }, []);

  // 그리기 기능
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

  // 전체 지우기
  const clearCanvas = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        {COLOR_DATA.map(color => (
          <li className="color" key={color.id}>
            <input
              type="radio"
              id={`color${color.id}`}
              name="colorGroup"
              className="formRadio"
            />
            <label htmlFor={`color${color.id}`} className="formLabel">
              <span>{color.name}</span>
            </label>
          </li>
        ))}
        {DRAW_DATA.map(draw => (
          <li className="draw" key={draw.id}>
            <input
              type="radio"
              id={`draw${draw.id}`}
              name="drawGroup"
              className="formRadio"
            />
            <label htmlFor={`draw${draw.id}`} className="formLabel">
              <span>{draw.name}</span>
            </label>
          </li>
        ))}
        <li className="draw">
          <button type="button" className="btn" onClick={clearCanvas}>
            <span>전체 지우기</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Canvas;

const COLOR_DATA = [
  { id: 1, name: '빨강' },
  { id: 2, name: '주황' },
  { id: 3, name: '노랑' },
  { id: 4, name: '초록' },
  { id: 5, name: '파랑' },
  { id: 6, name: '남색' },
  { id: 7, name: '보라' },
  { id: 8, name: '흰색' },
  { id: 9, name: '검정' },
];

const DRAW_DATA = [
  { id: 1, name: '연필' },
  { id: 2, name: '지우개' },
];
