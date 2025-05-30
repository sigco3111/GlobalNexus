/**
 * 더블 버퍼링 캔버스 커스텀 훅
 * 컴포넌트에서 더블 버퍼링 캔버스를 쉽게 사용할 수 있게 해주는 훅입니다.
 */
import { useState, useEffect, useRef } from 'react';
import { DoubleBufferCanvas } from '@/systems/GameLoop';

export interface UseDoubleBufferOptions {
  width: number;
  height: number;
  onResize?: (width: number, height: number) => void;
}

/**
 * 더블 버퍼링 캔버스 사용을 위한 커스텀 훅
 * @param options 더블 버퍼 옵션
 * @returns 더블 버퍼 캔버스 및 관련 함수
 */
export function useDoubleBuffer(options: UseDoubleBufferOptions) {
  const { width, height, onResize } = options;
  
  // 컨테이너 및 더블 버퍼 캔버스 참조
  const containerRef = useRef<HTMLDivElement>(null);
  const doubleBufferRef = useRef<DoubleBufferCanvas | null>(null);
  
  // 컨텍스트 상태
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  
  // 더블 버퍼 캔버스 초기화
  useEffect(() => {
    if (!containerRef.current) return;
    
    const doubleBuffer = new DoubleBufferCanvas(containerRef.current, width, height);
    doubleBufferRef.current = doubleBuffer;
    
    // 컨텍스트 저장
    const ctx = doubleBuffer.getContext();
    setContext(ctx);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      // 캔버스 제거 (필요한 경우)
      if (containerRef.current && containerRef.current.contains(doubleBuffer.displayCanvas)) {
        containerRef.current.removeChild(doubleBuffer.displayCanvas);
      }
    };
  }, []);
  
  // 크기 변경 시 처리
  useEffect(() => {
    if (!doubleBufferRef.current) return;
    
    doubleBufferRef.current.resize(width, height);
    
    if (onResize) {
      onResize(width, height);
    }
  }, [width, height, onResize]);
  
  // 버퍼 클리어 함수
  const clear = () => {
    if (doubleBufferRef.current) {
      doubleBufferRef.current.clear();
    }
  };
  
  // 버퍼 플립 함수
  const flip = () => {
    if (doubleBufferRef.current) {
      doubleBufferRef.current.flip();
    }
  };
  
  return {
    containerRef,
    context,
    clear,
    flip,
    displayCanvas: doubleBufferRef.current?.displayCanvas,
    bufferCanvas: doubleBufferRef.current?.bufferCanvas,
  };
} 