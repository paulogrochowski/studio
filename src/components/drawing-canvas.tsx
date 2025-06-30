'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Brush, Eraser, Trash2 } from 'lucide-react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface DrawingCanvasProps {
  onDrawingReady: (dataUrl: string) => void;
}

export function DrawingCanvas({ onDrawingReady }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  const getCoords = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    }
    const touch = event.touches[0];
    return { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      const currentCompositeOp = context.globalCompositeOperation;
      
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      context.globalCompositeOperation = currentCompositeOp;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const scale = window.devicePixelRatio || 1;
    // Check if canvas dimensions are not 0 to avoid errors.
    if(canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return;
    
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(scale, scale);
    contextRef.current = context;

    clearCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!contextRef.current) return;
    if (mode === 'draw') {
        contextRef.current.globalCompositeOperation = 'source-over';
        contextRef.current.strokeStyle = color;
    } else {
        contextRef.current.globalCompositeOperation = 'destination-out';
    }
    contextRef.current.lineWidth = brushSize;
  }, [mode, color, brushSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoords(e.nativeEvent);
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    e.preventDefault();
  };

  const finishDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoords(e.nativeEvent);
    if (!contextRef.current) return;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    e.preventDefault();
  };

  const handleUseDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onDrawingReady(dataUrl);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="border-2 border-dashed rounded-lg overflow-hidden aspect-square touch-none bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={draw}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex items-center gap-2">
            <Button aria-label="Desenhar" variant={mode === 'draw' ? 'secondary' : 'outline'} size="icon" onClick={() => setMode('draw')}><Brush/></Button>
            <Button aria-label="Apagar" variant={mode === 'erase' ? 'secondary' : 'outline'} size="icon" onClick={() => setMode('erase')}><Eraser/></Button>
            <Button aria-label="Limpar tudo" variant="outline" size="icon" onClick={clearCanvas}><Trash2/></Button>
            <input aria-label="Seletor de cor" type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-md border-0 bg-transparent cursor-pointer" disabled={mode === 'erase'} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brush-size">Tamanho: {brushSize}</Label>
          <Slider 
            id="brush-size"
            min={1} 
            max={50} 
            step={1} 
            value={[brushSize]} 
            onValueChange={(val) => setBrushSize(val[0])} 
          />
        </div>
      </div>
      <Button onClick={handleUseDrawing}>Usar este Desenho</Button>
    </div>
  );
}
