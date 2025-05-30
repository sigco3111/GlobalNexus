/**
 * 세계 지도 실제 데이터
 * 국가별 경계 및 정보를 포함하는 TopoJSON 데이터와 변환 유틸리티
 */
import * as topojson from 'topojson-client';
import { WorldMapData, WorldMapFeature } from './worldMap';

// 각 대륙별 주요 국가 정보
export const continentInfo = {
  Asia: {
    countries: [
      { id: 'KOR', name: '대한민국', iso_a2: 'KR', iso_a3: 'KOR' },
      { id: 'JPN', name: '일본', iso_a2: 'JP', iso_a3: 'JPN' },
      { id: 'CHN', name: '중국', iso_a2: 'CN', iso_a3: 'CHN' },
      { id: 'IND', name: '인도', iso_a2: 'IN', iso_a3: 'IND' },
      { id: 'RUS', name: '러시아', iso_a2: 'RU', iso_a3: 'RUS' },
      { id: 'IDN', name: '인도네시아', iso_a2: 'ID', iso_a3: 'IDN' },
      { id: 'THA', name: '태국', iso_a2: 'TH', iso_a3: 'THA' },
      { id: 'VNM', name: '베트남', iso_a2: 'VN', iso_a3: 'VNM' },
      { id: 'MYS', name: '말레이시아', iso_a2: 'MY', iso_a3: 'MYS' },
    ],
    resources: ['석유', '천연가스', '철광석', '보크사이트', '고무', '팜유', '반도체', '석탄', '목재']
  },
  Europe: {
    countries: [
      { id: 'GBR', name: '영국', iso_a2: 'GB', iso_a3: 'GBR' },
      { id: 'FRA', name: '프랑스', iso_a2: 'FR', iso_a3: 'FRA' },
      { id: 'DEU', name: '독일', iso_a2: 'DE', iso_a3: 'DEU' },
      { id: 'ITA', name: '이탈리아', iso_a2: 'IT', iso_a3: 'ITA' },
      { id: 'ESP', name: '스페인', iso_a2: 'ES', iso_a3: 'ESP' },
      { id: 'SWE', name: '스웨덴', iso_a2: 'SE', iso_a3: 'SWE' },
      { id: 'NLD', name: '네덜란드', iso_a2: 'NL', iso_a3: 'NLD' },
      { id: 'POL', name: '폴란드', iso_a2: 'PL', iso_a3: 'POL' },
      { id: 'CHE', name: '스위스', iso_a2: 'CH', iso_a3: 'CHE' },
    ],
    resources: ['철강', '자동차', '의약품', '패션', '와인', '기계류', '항공기', '금융', '관광']
  },
  'North America': {
    countries: [
      { id: 'USA', name: '미국', iso_a2: 'US', iso_a3: 'USA' },
      { id: 'CAN', name: '캐나다', iso_a2: 'CA', iso_a3: 'CAN' },
      { id: 'MEX', name: '멕시코', iso_a2: 'MX', iso_a3: 'MEX' },
    ],
    resources: ['석유', '천연가스', '곡물', '소프트웨어', '항공우주', '철강', '자동차', '석탄', '금융']
  },
  'South America': {
    countries: [
      { id: 'BRA', name: '브라질', iso_a2: 'BR', iso_a3: 'BRA' },
      { id: 'ARG', name: '아르헨티나', iso_a2: 'AR', iso_a3: 'ARG' },
      { id: 'COL', name: '콜롬비아', iso_a2: 'CO', iso_a3: 'COL' },
      { id: 'PER', name: '페루', iso_a2: 'PE', iso_a3: 'PER' },
      { id: 'CHL', name: '칠레', iso_a2: 'CL', iso_a3: 'CHL' },
    ],
    resources: ['구리', '철광석', '석유', '커피', '대두', '목재', '설탕', '천연가스', '은']
  },
  Africa: {
    countries: [
      { id: 'ZAF', name: '남아프리카공화국', iso_a2: 'ZA', iso_a3: 'ZAF' },
      { id: 'EGY', name: '이집트', iso_a2: 'EG', iso_a3: 'EGY' },
      { id: 'NGA', name: '나이지리아', iso_a2: 'NG', iso_a3: 'NGA' },
      { id: 'KEN', name: '케냐', iso_a2: 'KE', iso_a3: 'KEN' },
      { id: 'MAR', name: '모로코', iso_a2: 'MA', iso_a3: 'MAR' },
      { id: 'DZA', name: '알제리', iso_a2: 'DZ', iso_a3: 'DZA' },
      { id: 'AGO', name: '앙골라', iso_a2: 'AO', iso_a3: 'AGO' },
    ],
    resources: ['석유', '다이아몬드', '금', '우라늄', '카카오', '구리', '코발트', '철광석', '천연가스']
  },
  Oceania: {
    countries: [
      { id: 'AUS', name: '호주', iso_a2: 'AU', iso_a3: 'AUS' },
      { id: 'NZL', name: '뉴질랜드', iso_a2: 'NZ', iso_a3: 'NZL' },
      { id: 'PNG', name: '파푸아뉴기니', iso_a2: 'PG', iso_a3: 'PNG' },
    ],
    resources: ['철광석', '석탄', '금', '알루미늄', '구리', '목재', '양모', '천연가스', '우라늄']
  }
};

// 각 대륙별 국가 ID 배열
export const continentCountries = Object.entries(continentInfo).reduce((acc, [continent, info]) => {
  acc[continent] = info.countries.map(country => country.id);
  return acc;
}, {} as Record<string, string[]>);

// 국가별 기본 자원 데이터
export const countryResources = {
  // 아시아
  KOR: ['반도체', '자동차', '철강', '조선'],
  JPN: ['자동차', '전자제품', '철강', '조선'],
  CHN: ['석탄', '철광석', '희토류', '전자제품'],
  IND: ['철광석', '보크사이트', '석탄', '면화'],
  IDN: ['석유', '천연가스', '석탄', '팜유'],
  
  // 유럽
  GBR: ['석유', '천연가스', '금융', '의약품'],
  FRA: ['와인', '항공우주', '의약품', '패션'],
  DEU: ['자동차', '기계류', '화학제품', '전자제품'],
  ITA: ['패션', '자동차', '기계류', '관광'],
  
  // 북미
  USA: ['석유', '천연가스', '곡물', '소프트웨어'],
  CAN: ['석유', '천연가스', '목재', '곡물'],
  MEX: ['석유', '은', '과일', '자동차'],
  
  // 남미
  BRA: ['철광석', '석유', '대두', '커피'],
  ARG: ['대두', '밀', '석유', '천연가스'],
  
  // 아프리카
  ZAF: ['금', '다이아몬드', '백금', '석탄'],
  NGA: ['석유', '천연가스', '석탄', '주석'],
  
  // 오세아니아
  AUS: ['철광석', '석탄', '금', '천연가스'],
  NZL: ['양모', '낙농품', '목재', '알루미늄']
};

// 간소화된 세계 지도 데이터 (예시)
// 실제 구현에서는 보다 완전한 데이터가 필요합니다
export const worldMapSampleData: WorldMapData = {
  type: "FeatureCollection",
  features: [
    // 아시아
    {
      type: "Feature",
      id: "KOR",
      properties: {
        name: "대한민국",
        iso_a2: "KR",
        iso_a3: "KOR",
        continent: "Asia"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [126.451, 34.793],
            [127.838, 34.798],
            [128.209, 35.937],
            [129.46, 35.49],
            [129.468, 37.097],
            [130.223, 37.425],
            [130.745, 36.893],
            [126.174, 37.749],
            [126.237, 37.54],
            [126.451, 34.793]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "JPN",
      properties: {
        name: "일본",
        iso_a2: "JP",
        iso_a3: "JPN",
        continent: "Asia"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [134.638, 34.149],
              [134.766, 33.806],
              [134.203, 33.201],
              [133.792, 33.521],
              [134.638, 34.149]
            ]
          ],
          [
            [
              [140.976, 37.142],
              [140.599, 36.343],
              [140.774, 35.842],
              [140.253, 35.138],
              [138.975, 34.658],
              [137.217, 34.606],
              [135.792, 33.464],
              [135.121, 33.849],
              [135.074, 34.596],
              [133.340, 34.375],
              [132.157, 33.904],
              [130.986, 33.885],
              [132.000, 33.149],
              [131.332, 31.450],
              [130.686, 31.029],
              [130.198, 31.418],
              [130.447, 32.319],
              [129.814, 32.610],
              [129.408, 33.296],
              [130.353, 33.604],
              [130.878, 34.232],
              [131.884, 34.749],
              [132.617, 35.433],
              [134.608, 35.731],
              [135.677, 35.527],
              [136.723, 37.304],
              [137.390, 36.827],
              [138.857, 37.827],
              [139.426, 38.215],
              [140.054, 39.438],
              [139.883, 40.563],
              [140.305, 41.195],
              [141.368, 41.379],
              [141.914, 39.991],
              [141.884, 39.180],
              [140.959, 38.174],
              [140.976, 37.142]
            ]
          ]
        ]
      }
    },
    // 북미
    {
      type: "Feature",
      id: "USA",
      properties: {
        name: "미국",
        iso_a2: "US",
        iso_a3: "USA",
        continent: "North America"
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-155.54, 19.08],
              [-155.68, 18.91],
              [-155.93, 19.05],
              [-155.9, 19.33],
              [-155.8, 19.5],
              [-155.54, 19.08]
            ]
          ],
          [
            [
              [-156.07, 20.64],
              [-156.02, 20.55],
              [-156.14, 20.39],
              [-156.24, 20.57],
              [-156.07, 20.64]
            ]
          ]
        ]
      }
    },
    // 유럽
    {
      type: "Feature",
      id: "FRA",
      properties: {
        name: "프랑스",
        iso_a2: "FR",
        iso_a3: "FRA",
        continent: "Europe"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.52, 51.15],
            [2.05, 50.80],
            [1.66, 50.95],
            [1.39, 51.00],
            [1.22, 50.84],
            [0.71, 50.77],
            [0.02, 50.53],
            [-0.20, 49.85],
            [0.19, 49.58],
            [0.58, 49.44],
            [1.16, 49.22],
            [1.52, 49.05],
            [1.67, 49.07],
            [1.61, 48.64],
            [1.81, 48.63],
            [2.19, 48.83],
            [2.47, 48.89],
            [2.54, 49.11],
            [2.99, 49.38],
            [3.14, 49.54],
            [3.58, 49.93],
            [4.05, 49.95],
            [4.44, 50.19],
            [4.82, 50.16],
            [5.06, 50.05],
            [5.59, 49.85],
            [5.89, 49.45],
            [6.18, 49.48],
            [6.66, 49.46],
            [8.10, 49.01],
            [7.59, 48.33],
            [7.47, 47.62],
            [7.19, 47.45],
            [6.80, 47.54],
            [6.67, 47.29],
            [6.22, 46.84],
            [6.03, 46.42],
            [6.53, 46.43],
            [6.80, 46.14],
            [6.74, 45.99],
            [7.10, 45.92],
            [7.15, 45.73],
            [6.99, 45.43],
            [6.77, 45.18],
            [7.01, 45.03],
            [7.07, 44.76],
            [7.68, 44.45],
            [7.57, 44.12],
            [7.01, 43.75],
            [6.89, 43.57],
            [7.66, 43.41],
            [7.42, 43.69],
            [6.51, 43.12],
            [4.56, 43.39],
            [3.24, 43.07],
            [2.65, 42.78],
            [1.83, 42.55],
            [0.70, 42.80],
            [0.34, 42.58],
            [-1.50, 43.03],
            [-1.90, 43.42],
            [-1.38, 44.02],
            [-1.19, 46.01],
            [-2.22, 47.06],
            [-2.96, 47.57],
            [-4.49, 47.95],
            [-4.59, 48.68],
            [-3.29, 48.90],
            [-1.62, 48.64],
            [-1.93, 49.78],
            [-0.99, 49.35],
            [1.33, 50.13],
            [1.64, 50.95],
            [2.52, 51.15]
          ]
        ]
      }
    }
  ]
};

// TopoJSON 데이터를 GeoJSON으로 변환하는 유틸리티 함수
export function topoToGeo(topoData: any, objectName: string): WorldMapData {
  const geoData = topojson.feature(topoData, topoData.objects[objectName]);
  return geoData as unknown as WorldMapData;
}

// 국가 정보를 GeoJSON 피처에 병합하는 함수
export function enhanceGeoData(geoData: WorldMapData): WorldMapData {
  return {
    ...geoData,
    features: geoData.features.map(feature => {
      const id = feature.id;
      
      // 대륙 정보 찾기
      let continent = '';
      for (const [cont, countries] of Object.entries(continentCountries)) {
        if (countries.includes(id as string)) {
          continent = cont;
          break;
        }
      }
      
      // 국가 정보 찾기
      let countryInfo = { name: feature.properties?.name || id, iso_a2: '', iso_a3: id };
      
      if (continent) {
        const foundCountry = continentInfo[continent as keyof typeof continentInfo]?.countries.find(
          c => c.id === id
        );
        
        if (foundCountry) {
          countryInfo = { 
            name: foundCountry.name,
            iso_a2: foundCountry.iso_a2,
            iso_a3: foundCountry.iso_a3
          };
        }
      }
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          ...countryInfo,
          continent
        }
      };
    })
  };
}

// 샘플 데이터를 강화하여 반환
export const enhancedWorldMapData = enhanceGeoData(worldMapSampleData); 