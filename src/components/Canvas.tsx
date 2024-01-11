import React, { useRef, useState, useEffect } from 'react';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [painting, setPainting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000');

  useEffect(() => {
    const pencilRadio = document.getElementById('draw1') as HTMLInputElement;
    const blackRadio = document.getElementById('color9') as HTMLInputElement;
    if (pencilRadio && blackRadio) {
      pencilRadio.checked = true;
      blackRadio.checked = true;
    }

    const canvas = canvasRef.current;
    if (canvas !== null) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    const ctx = canvas?.getContext('2d');
    if (ctx !== null && ctx !== undefined) {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 3;
      setCtx(ctx);
    }
  }, []);

  // 컬러 변경
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  // 그리기
  type DrawEvent =
    | React.MouseEvent<HTMLCanvasElement, MouseEvent>
    | React.ChangeEvent<HTMLInputElement>;
  const drawFn = (e: DrawEvent) => {
    if (e.type === 'mousemove') {
      const canvas = canvasRef.current;
      if (canvas !== null) {
        const mouseEvent = e as React.MouseEvent<HTMLCanvasElement, MouseEvent>;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (mouseEvent.clientX - rect.left) * scaleX;
        const mouseY = (mouseEvent.clientY - rect.top) * scaleY;

        if (!painting) {
          if (ctx) {
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
          }
        } else {
          if (ctx) {
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = selectedColor;
            ctx.stroke();
          }
        }
      }
    } else if (e.type === 'change') {
      const canvas = canvasRef.current;
      if (canvas && ctx) {
        const mouseEvent = e as React.MouseEvent<HTMLCanvasElement, MouseEvent>;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (mouseEvent.clientX - rect.left) * scaleX;
        const mouseY = (mouseEvent.clientY - rect.top) * scaleY;

        if (ctx) {
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = selectedColor;
          ctx.globalCompositeOperation = 'source-over';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    }
  };

  // 지우개
  const eraseFn = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    }
  };

  // 전체 지우기
  const clearCanvas = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setPainting(false);
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
              onChange={() => handleColorChange(color.color)}
            />
            <label htmlFor={`color${color.id}`} className="formLabel">
              <span>{color.name}</span>
            </label>
          </li>
        ))}
        <li className="draw">
          <input
            type="radio"
            id="draw1"
            name="drawGroup"
            className="formRadio"
            onChange={drawFn}
          />
          <label htmlFor="draw1" className="formLabel">
            <span>연필</span>
          </label>
        </li>
        <li className="draw">
          <input
            type="radio"
            id="draw2"
            name="drawGroup"
            className="formRadio"
            onChange={eraseFn}
          />
          <label htmlFor="draw2" className="formLabel">
            <span>지우개</span>
          </label>
        </li>
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
  { id: 1, name: '빨강', color: '#f00' },
  { id: 2, name: '주황', color: '#ff8c00' },
  { id: 3, name: '노랑', color: '#ff0' },
  { id: 4, name: '초록', color: '#008000' },
  { id: 5, name: '파랑', color: '#00f' },
  { id: 6, name: '남색', color: '#4b0082' },
  { id: 7, name: '보라', color: '#800080' },
  { id: 8, name: '흰색', color: '#fff' },
  { id: 9, name: '검정', color: '#000' },
];
