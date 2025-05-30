'use client';

/**
 * 게임 캔버스 컴포넌트
 * 게임 루프와 더블 버퍼링을 결합한 기본 게임 렌더링 컴포넌트입니다.
 */
import React, { useEffect, useState } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useDoubleBuffer } from '@/hooks/useDoubleBuffer';
import { useGameProgress } from '@/hooks/useGameState';

interface GameCanvasProps {
  width: number;
  height: number;
  className?: string;
}

/**
 * 게임 캔버스 컴포넌트
 * 게임 루프와 더블 버퍼링을 사용한 기본 캔버스 컴포넌트
 */
const GameCanvas: React.FC<GameCanvasProps> = ({ width, height, className }) => {
  // 게임 진행 상태 가져오기
  const { 
    isGameStarted, 
    isPaused, 
    gameSpeed 
  } = useGameProgress();
  
  // FPS 계산용 상태
  const [fps, setFps] = useState<number>(0);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [lastFpsUpdate, setLastFpsUpdate] = useState<number>(0);
  
  // 더블 버퍼 설정
  const { 
    containerRef, 
    context, 
    clear, 
    flip 
  } = useDoubleBuffer({ width, height });
  
  // 게임 루프 콜백 함수
  const handleUpdate = (dt: number) => {
    // 프레임 카운트 증가
    setFrameCount(prev => prev + 1);
    
    // FPS 계산 (1초마다)
    const now = performance.now();
    if (now - lastFpsUpdate >= 1000) {
      setFps(frameCount);
      setFrameCount(0);
      setLastFpsUpdate(now);
    }
    
    // 여기에 게임 로직 업데이트 코드 추가
    // 예: 게임 객체 이동, 충돌 검사 등
  };
  
  // 렌더링 콜백 함수
  const handleRender = () => {
    if (!context) return;
    
    // 버퍼 초기화
    clear();
    
    // 여기에 게임 렌더링 코드 추가
    // 예: 배경, 객체, UI 등 그리기
    
    // 간단한 예시: FPS 표시
    context.fillStyle = '#333';
    context.font = '16px Arial';
    context.fillText(`FPS: ${fps}`, 10, 20);
    
    // 게임 속도 표시
    context.fillText(`Speed: x${gameSpeed}`, 10, 45);
    
    // 버퍼 플립 (화면에 표시)
    flip();
  };
  
  // 게임 루프 설정
  const { 
    isRunning, 
    start, 
    pause, 
    resume 
  } = useGameLoop({
    fps: 60 * gameSpeed, // 게임 속도에 따라 FPS 조정
    onUpdate: handleUpdate,
    onRender: handleRender,
    autoStart: false,
  });
  
  // 게임 상태 변경 시 게임 루프 제어
  useEffect(() => {
    if (isGameStarted && !isPaused && !isRunning) {
      start();
    } else if (isPaused && isRunning) {
      pause();
    } else if (isGameStarted && !isPaused && !isRunning) {
      resume();
    }
  }, [isGameStarted, isPaused, isRunning, start, pause, resume]);
  
  // 게임 속도 변경 시 게임 루프 재시작
  useEffect(() => {
    if (isRunning) {
      pause();
      resume();
    }
  }, [gameSpeed, isRunning, pause, resume]);
  
  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
};

export default GameCanvas; 