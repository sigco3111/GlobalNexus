'use client';

/**
 * 세계 지도 컴포넌트
 * 세계 지도를 렌더링하고 지역 정보 패널과 통합합니다.
 */
import React, { useRef, useEffect, useState } from 'react';
import { MapRenderer } from '@/systems/MapRenderer';
import { worldMapData } from '@/data/worldMap';
import RegionInfoPanel from './RegionInfoPanel';
import { useRegions } from '@/hooks/useGameState';

interface WorldMapProps {
  width: number;
  height: number;
  className?: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ width, height, className }) => {
  // 캔버스 요소 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 맵 렌더러 참조
  const rendererRef = useRef<MapRenderer | null>(null);
  
  // 선택된 지역 상태
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  
  // 지역 데이터 및 액션 가져오기
  const { regions } = useRegions();
  
  // 지역별 색상 데이터 생성
  const getRegionColors = () => {
    const colors: { [key: string]: { color: string } } = {};
    
    // 기본 색상 설정
    worldMapData.features.forEach(feature => {
      colors[feature.id] = { color: '#d8d8d8' }; // 기본 회색
    });
    
    // 영향력에 따른 색상 설정
    regions.forEach(region => {
      const influence = region.influence;
      
      // 영향력에 따라 색상 그라데이션 (파란색 계열)
      if (influence > 0) {
        const intensity = Math.min(255, Math.round(influence * 2.55));
        const color = `rgb(${255 - intensity}, ${255 - Math.round(intensity * 0.4)}, 255)`;
        colors[region.regionId] = { color };
      }
    });
    
    return colors;
  };
  
  // 지도 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // 맵 렌더러 생성
    rendererRef.current = new MapRenderer(
      canvasRef.current,
      worldMapData,
      {
        width,
        height,
        center: [0, 20], // 초기 중심점
        scale: 150,
        regions: getRegionColors(),
        selectedRegionId
      }
    );
    
    // 지역 클릭 이벤트 리스너
    const handleRegionClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedRegionId(customEvent.detail.regionId);
    };
    
    // 이벤트 리스너 등록
    canvasRef.current.addEventListener('regionClick', handleRegionClick);
    
    // 클린업 함수
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('regionClick', handleRegionClick);
      }
    };
  }, [width, height]);
  
  // 선택된 지역 또는 영향력 변경 시 지도 업데이트
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.updateOptions({
        regions: getRegionColors(),
        selectedRegionId
      });
    }
  }, [selectedRegionId, regions]);
  
  // 지역 정보 패널 닫기
  const handleClosePanel = () => {
    setSelectedRegionId(null);
  };
  
  return (
    <div className={`relative ${className || ''}`}>
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-pointer"
      />
      
      {/* 지역 정보 패널 */}
      <RegionInfoPanel 
        regionId={selectedRegionId}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default WorldMap; 