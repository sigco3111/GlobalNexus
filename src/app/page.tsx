/**
 * 메인 페이지 컴포넌트
 * 애플리케이션의 메인 페이지입니다.
 */
import React from 'react';
import dynamic from 'next/dynamic';

// 클라이언트 컴포넌트 동적 임포트
const GameStateTest = dynamic(() => import('@/components/GameStateTest'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Global Nexus</h1>
      <GameStateTest />
    </main>
  );
} 