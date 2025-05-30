'use client';

/**
 * 세계 지도 데이터 로더
 * TopoJSON 데이터를 GeoJSON으로 변환하여 지도 렌더링에 사용합니다.
 */
import * as topojson from 'topojson-client';
import { useEffect, useState } from 'react';
import { WorldMapData } from './worldMap';
import { enhancedWorldMapData } from './worldMapData';

/**
 * TopoJSON에서 GeoJSON으로 변환
 * @param topoData TopoJSON 데이터
 * @param objectName 객체 이름
 * @returns GeoJSON 형식의 세계 지도 데이터
 */
export function topoToGeo(topoData: any, objectName: string): WorldMapData {
  const geoData = topojson.feature(topoData, topoData.objects[objectName]);
  return geoData as unknown as WorldMapData;
}

/**
 * 세계 지도 데이터 로딩 훅
 * 실제 세계 지도 데이터를 로드하거나 샘플 데이터를 반환합니다.
 */
export function useWorldMapData() {
  const [worldData, setWorldData] = useState<WorldMapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorldMapData() {
      try {
        // 실제 세계 지도 데이터 로드 시도
        const response = await fetch('/world-atlas.json');
        if (!response.ok) {
          throw new Error('세계 지도 데이터를 로드할 수 없습니다.');
        }
        
        const topoData = await response.json();
        const geoData = topoToGeo(topoData, 'countries');
        
        // 각 국가에 대륙 정보와 이름 추가
        const enhancedData = {
          ...geoData,
          features: geoData.features.map((feature: any) => {
            // ID가 있는 경우 그대로 사용, 없으면 properties에서 가져오기
            const id = feature.id || feature.properties?.iso_a3 || '';
            
            return {
              ...feature,
              id,
              properties: {
                ...feature.properties,
                continent: getContinentForCountry(id),
                iso_a3: id,
                iso_a2: '',
                name: getCountryName(id)
              }
            };
          })
        };
        
        setWorldData(enhancedData);
        setIsLoading(false);
      } catch (err) {
        console.error('세계 지도 데이터 로드 오류:', err);
        console.log('샘플 데이터를 대신 사용합니다.');
        
        // 오류 시 샘플 데이터 사용
        setWorldData(enhancedWorldMapData);
        setError('세계 지도 데이터 로드 중 오류가 발생했습니다. 샘플 데이터를 사용합니다.');
        setIsLoading(false);
      }
    }
    
    loadWorldMapData();
  }, []);

  return { worldData, isLoading, error };
}

/**
 * 국가 ID에 따른 대륙 정보 반환
 * @param countryId 국가 ID
 * @returns 대륙 이름
 */
function getContinentForCountry(countryId: string): string {
  // 주요 대륙별 국가 매핑 (간소화된 버전)
  const continentMap: Record<string, string[]> = {
    'Asia': ['CHN', 'JPN', 'KOR', 'IND', 'IDN', 'VNM', 'THA', 'MYS', 'SGP', 'PHL'],
    'Europe': ['GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'RUS', 'UKR', 'POL', 'NLD', 'BEL', 'SWE', 'NOR', 'FIN', 'DNK', 'CHE', 'AUT'],
    'North America': ['USA', 'CAN', 'MEX', 'GTM', 'CUB', 'HTI', 'DOM', 'HND', 'SLV', 'NIC', 'CRI', 'PAN'],
    'South America': ['BRA', 'ARG', 'COL', 'PER', 'VEN', 'CHL', 'ECU', 'BOL', 'PRY', 'URY'],
    'Africa': ['ZAF', 'EGY', 'NGA', 'DZA', 'MAR', 'GHA', 'TUN', 'ETH', 'KEN', 'TZA', 'UGA', 'MOZ', 'ZWE'],
    'Oceania': ['AUS', 'NZL', 'PNG', 'FJI']
  };
  
  for (const [continent, countries] of Object.entries(continentMap)) {
    if (countries.includes(countryId)) {
      return continent;
    }
  }
  
  return 'Unknown';
}

/**
 * 국가 ID에 따른 국가 이름 반환
 * @param countryId 국가 ID
 * @returns 국가 이름
 */
function getCountryName(countryId: string): string {
  // 주요 국가 이름 매핑 (간소화된 버전)
  const countryNames: Record<string, string> = {
    'KOR': '대한민국',
    'JPN': '일본',
    'CHN': '중국',
    'USA': '미국',
    'GBR': '영국',
    'FRA': '프랑스',
    'DEU': '독일',
    'ITA': '이탈리아',
    'ESP': '스페인',
    'RUS': '러시아',
    'BRA': '브라질',
    'IND': '인도',
    'CAN': '캐나다',
    'AUS': '호주',
    'ZAF': '남아프리카공화국'
  };
  
  return countryNames[countryId] || countryId;
} 