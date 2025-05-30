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

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Global Nexus</h1>
      
      {/* 지도 섹션 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">세계 지도</h2>
        <WorldMap width={1000} height={600} className="border rounded shadow-lg" />
      </div>
      
      {/* 게임 상태 테스트 섹션 */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">게임 상태 테스트</h2>
        <GameStateTest />
      </div>
    </main>
  );
} 