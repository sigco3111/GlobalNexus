'use client';

/**
 * 지역 정보 패널 컴포넌트
 * 지도에서 선택된 지역의 정보와 액션을 표시합니다.
 */
import React, { useState, useEffect } from 'react';
import { useRegions } from '@/hooks/useGameState';
import { worldMapData } from '@/data/worldMap';
import { RegionInfluence } from '@/types/gameState';

interface RegionInfoPanelProps {
  regionId: string | null;
  onClose: () => void;
}

const RegionInfoPanel: React.FC<RegionInfoPanelProps> = ({ regionId, onClose }) => {
  // 지역 정보 및 액션 불러오기
  const { region, addRegionInfluence, setRegionRelationLevel, investInRegion } = useRegions(regionId || undefined);
  
  // 지역 기본 정보 찾기
  const regionData = regionId ? worldMapData.features.find(f => f.id === regionId) : null;
  
  // 투자 금액 상태
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  
  // 투자 금액 범위 조정
  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInvestmentAmount(isNaN(value) ? 1000 : value);
  };
  
  // 투자 버튼 클릭 핸들러
  const handleInvest = () => {
    if (regionId && investmentAmount > 0) {
      investInRegion(regionId, investmentAmount);
    }
  };
  
  // 관계 레벨 업그레이드 핸들러
  const handleUpgradeRelation = () => {
    if (regionId && region) {
      setRegionRelationLevel(regionId, region.relationLevel + 1);
    }
  };
  
  // 패널이 열릴 때 애니메이션 효과
  useEffect(() => {
    if (regionId) {
      const panel = document.getElementById('region-info-panel');
      if (panel) {
        panel.classList.add('slide-in');
      }
    }
  }, [regionId]);
  
  // 지역 ID가 없으면 렌더링하지 않음
  if (!regionId || !regionData) {
    return null;
  }
  
  // 관계 레벨 표시 문자열
  const getRelationLevelText = (level: number) => {
    switch (level) {
      case 0: return '적대적';
      case 1: return '경계';
      case 2: return '중립';
      case 3: return '우호적';
      case 4: return '협력';
      case 5: return '동맹';
      default: return '알 수 없음';
    }
  };
  
  return (
    <div 
      id="region-info-panel"
      className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-4 overflow-y-auto z-50 transition-transform duration-300"
    >
      {/* 패널 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{regionData.properties.name}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* 지역 기본 정보 */}
      <div className="mb-4 p-3 bg-gray-100 rounded-md">
        <p><span className="font-medium">대륙:</span> {regionData.properties.continent}</p>
        <p><span className="font-medium">국가 코드:</span> {regionData.properties.iso_a3}</p>
      </div>
      
      {/* 영향력 및 관계 정보 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">지역 관계</h3>
        
        {region ? (
          <>
            {/* 영향력 표시 */}
            <div className="mb-2">
              <div className="flex justify-between">
                <span>영향력:</span>
                <span>{Math.round(region.influence)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${region.influence}%` }}
                ></div>
              </div>
            </div>
            
            {/* 관계 레벨 표시 */}
            <div className="mb-2">
              <div className="flex justify-between">
                <span>관계 수준:</span>
                <span>{getRelationLevelText(region.relationLevel)} (레벨 {region.relationLevel})</span>
              </div>
              <div className="flex justify-between space-x-1 mt-1">
                {[0, 1, 2, 3, 4, 5].map(level => (
                  <div 
                    key={level}
                    className={`h-2 flex-1 rounded-sm ${
                      level <= region.relationLevel ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* 총 투자 금액 */}
            <p className="mb-4">
              <span className="font-medium">총 투자 금액:</span> {region.investment.toLocaleString()}원
            </p>
            
            {/* 관계 레벨 업그레이드 버튼 */}
            {region.relationLevel < 5 && (
              <button
                onClick={handleUpgradeRelation}
                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
                disabled={region.influence < (region.relationLevel + 1) * 20}
              >
                관계 레벨 업그레이드
                {region.influence < (region.relationLevel + 1) * 20 && (
                  <span className="block text-xs mt-1">
                    (필요 영향력: {(region.relationLevel + 1) * 20}%)
                  </span>
                )}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">이 지역에 대한 관계가 아직 설정되지 않았습니다.</p>
        )}
      </div>
      
      {/* 투자 섹션 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">지역 투자</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            value={investmentAmount}
            onChange={handleInvestmentChange}
            min="1000"
            step="1000"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleInvest}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            투자
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          * 투자는 지역 영향력을 증가시킵니다.
        </p>
      </div>
      
      {/* 지역 자원 섹션 (향후 구현) */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">지역 자원</h3>
        <p className="text-gray-500 italic">향후 업데이트될 예정입니다.</p>
      </div>
    </div>
  );
};

export default RegionInfoPanel; 