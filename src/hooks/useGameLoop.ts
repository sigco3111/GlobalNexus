/**
 * 게임 루프 커스텀 훅
 * 컴포넌트에서 게임 루프를 쉽게 사용할 수 있도록 해주는 훅입니다.
 */
import { useState, useEffect, useRef } from 'react';
import { GameLoop, GameLoopOptions } from '@/systems/GameLoop';

export interface UseGameLoopOptions extends Omit<GameLoopOptions, 'updateCallback' | 'renderCallback'> {
  onUpdate?: (dt: number) => void;
  onRender?: () => void;
  autoStart?: boolean;
  pauseOnUnmount?: boolean;
}

/**
 * 게임 루프 사용을 위한 커스텀 훅
 * @param options 게임 루프 옵션
 * @returns 게임 루프 상태 및 제어 함수
 */
export function useGameLoop(options: UseGameLoopOptions = {}) {
  const {
    fps = 60,
    fixedTimeStep = true,
    autoStart = false,
    pauseOnUnmount = true,
    onUpdate = () => {},
    onRender = () => {},
  } = options;

  // 게임 루프 참조 저장
  const gameLoopRef = useRef<GameLoop | null>(null);
  
  // 게임 루프 상태
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 게임 루프 초기화
  useEffect(() => {
    const gameLoop = new GameLoop({
      fps,
      fixedTimeStep,
      updateCallback: onUpdate,
      renderCallback: onRender,
    });

    gameLoopRef.current = gameLoop;

    // 자동 시작 옵션이 있을 경우 게임 루프 시작
    if (autoStart) {
      gameLoop.start();
      setIsRunning(true);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (pauseOnUnmount && gameLoopRef.current) {
        gameLoopRef.current.pause();
      }
    };
  }, [fps, fixedTimeStep, onUpdate, onRender, autoStart, pauseOnUnmount]);

  // 게임 루프 시작 함수
  const startGameLoop = () => {
    if (gameLoopRef.current && !isRunning) {
      gameLoopRef.current.start();
      setIsRunning(true);
    }
  };

  // 게임 루프 일시 정지 함수
  const pauseGameLoop = () => {
    if (gameLoopRef.current && isRunning) {
      gameLoopRef.current.pause();
      setIsRunning(false);
    }
  };

  // 게임 루프 중지 및 리셋 함수
  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
      setIsRunning(false);
    }
  };

  // 게임 루프 재개 함수
  const resumeGameLoop = () => {
    if (gameLoopRef.current && !isRunning) {
      gameLoopRef.current.start();
      setIsRunning(true);
    }
  };

  return {
    isRunning,
    start: startGameLoop,
    pause: pauseGameLoop,
    stop: stopGameLoop,
    resume: resumeGameLoop,
  };
} 