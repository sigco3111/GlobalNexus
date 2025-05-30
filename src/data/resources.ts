/**
 * 게임 내 자원 데이터
 * 자원 유형, 특성 및 지역별 분포 정보를 정의합니다.
 */

// 자원 유형 정의
export enum ResourceType {
  RAW_MATERIAL = 'RAW_MATERIAL',     // 원자재
  INTERMEDIATE = 'INTERMEDIATE',      // 중간재
  FINISHED_PRODUCT = 'FINISHED_PRODUCT'  // 최종 제품
}

// 자원 카테고리 정의
export enum ResourceCategory {
  AGRICULTURAL = 'AGRICULTURAL',     // 농업
  MINERAL = 'MINERAL',               // 광물
  ENERGY = 'ENERGY',                 // 에너지
  INDUSTRIAL = 'INDUSTRIAL',         // 산업
  CONSUMER = 'CONSUMER',             // 소비재
  LUXURY = 'LUXURY',                 // 사치품
  TECHNOLOGY = 'TECHNOLOGY',         // 기술
  SERVICE = 'SERVICE'                // 서비스
}

// 자원 정의
export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  category: ResourceCategory;
  baseValue: number;  // 기본 가치
  weight: number;     // 무게 (운송 비용 계산용)
  volatility: number; // 가격 변동성 (0-1)
  description: string;
}

// 지역별 자원 분포 정의
export interface RegionResource {
  regionId: string;    // 지역 ID (국가 코드)
  resourceId: string;  // 자원 ID
  abundance: number;   // 풍부도 (0-1)
  extractionCost: number; // 채취 비용 계수
  quality: number;     // 품질 (0-1)
}

// 게임 내 자원 목록
export const resources: Resource[] = [
  // 원자재
  {
    id: 'iron_ore',
    name: '철광석',
    type: ResourceType.RAW_MATERIAL,
    category: ResourceCategory.MINERAL,
    baseValue: 50,
    weight: 2.5,
    volatility: 0.3,
    description: '제철 및 철강 생산의 기본 원료'
  },
  {
    id: 'crude_oil',
    name: '원유',
    type: ResourceType.RAW_MATERIAL,
    category: ResourceCategory.ENERGY,
    baseValue: 70,
    weight: 1.0,
    volatility: 0.5,
    description: '정제 과정을 거쳐 다양한 연료와 화학제품으로 변환'
  },
  {
    id: 'cotton',
    name: '면화',
    type: ResourceType.RAW_MATERIAL,
    category: ResourceCategory.AGRICULTURAL,
    baseValue: 30,
    weight: 0.7,
    volatility: 0.2,
    description: '직물 및 의류 생산의 주요 원료'
  },
  {
    id: 'wood',
    name: '목재',
    type: ResourceType.RAW_MATERIAL,
    category: ResourceCategory.AGRICULTURAL,
    baseValue: 25,
    weight: 1.2,
    volatility: 0.15,
    description: '건축 및 가구 제작에 사용되는 천연 자원'
  },
  {
    id: 'copper_ore',
    name: '구리 광석',
    type: ResourceType.RAW_MATERIAL,
    category: ResourceCategory.MINERAL,
    baseValue: 45,
    weight: 2.2,
    volatility: 0.25,
    description: '전기 전도성이 뛰어나 전자 제품 제조에 필수적인 금속 광석'
  },
  
  // 중간재
  {
    id: 'steel',
    name: '철강',
    type: ResourceType.INTERMEDIATE,
    category: ResourceCategory.INDUSTRIAL,
    baseValue: 120,
    weight: 2.0,
    volatility: 0.2,
    description: '철광석을 정제하여 만든 건축 및 제조업의 핵심 소재'
  },
  {
    id: 'plastic',
    name: '플라스틱',
    type: ResourceType.INTERMEDIATE,
    category: ResourceCategory.INDUSTRIAL,
    baseValue: 90,
    weight: 0.6,
    volatility: 0.2,
    description: '원유에서 추출한 화학 물질로 만든 범용 소재'
  },
  {
    id: 'fabric',
    name: '직물',
    type: ResourceType.INTERMEDIATE,
    category: ResourceCategory.INDUSTRIAL,
    baseValue: 80,
    weight: 0.4,
    volatility: 0.15,
    description: '면화 등의 원료를 가공하여 만든 의류 제작용 소재'
  },
  
  // 최종 제품
  {
    id: 'smartphone',
    name: '스마트폰',
    type: ResourceType.FINISHED_PRODUCT,
    category: ResourceCategory.TECHNOLOGY,
    baseValue: 500,
    weight: 0.2,
    volatility: 0.3,
    description: '첨단 기술이 집약된 현대 필수 통신 기기'
  },
  {
    id: 'furniture',
    name: '가구',
    type: ResourceType.FINISHED_PRODUCT,
    category: ResourceCategory.CONSUMER,
    baseValue: 200,
    weight: 5.0,
    volatility: 0.1,
    description: '목재와 금속으로 만든 일상 생활용 가구'
  },
  {
    id: 'clothing',
    name: '의류',
    type: ResourceType.FINISHED_PRODUCT,
    category: ResourceCategory.CONSUMER,
    baseValue: 150,
    weight: 0.3,
    volatility: 0.2,
    description: '직물을 가공하여 만든 일상 의류 제품'
  },
  {
    id: 'car',
    name: '자동차',
    type: ResourceType.FINISHED_PRODUCT,
    category: ResourceCategory.CONSUMER,
    baseValue: 15000,
    weight: 12.0,
    volatility: 0.2,
    description: '현대 이동수단의 대표적 제품, 여러 부품과 기술의 집합체'
  }
];

// 지역별 자원 분포 (예시)
export const regionResources: RegionResource[] = [
  // 한국
  { regionId: 'KOR', resourceId: 'iron_ore', abundance: 0.3, extractionCost: 1.2, quality: 0.7 },
  { regionId: 'KOR', resourceId: 'copper_ore', abundance: 0.2, extractionCost: 1.3, quality: 0.6 },
  
  // 미국
  { regionId: 'USA', resourceId: 'iron_ore', abundance: 0.6, extractionCost: 0.9, quality: 0.8 },
  { regionId: 'USA', resourceId: 'crude_oil', abundance: 0.7, extractionCost: 0.8, quality: 0.9 },
  { regionId: 'USA', resourceId: 'cotton', abundance: 0.8, extractionCost: 0.7, quality: 0.9 },
  { regionId: 'USA', resourceId: 'wood', abundance: 0.9, extractionCost: 0.6, quality: 0.8 }
];

// 제품 레시피 정의 (어떤 자원으로 어떤 제품을 만들 수 있는지)
export interface Recipe {
  id: string;
  name: string;
  output: {
    resourceId: string;
    amount: number;
  };
  inputs: {
    resourceId: string;
    amount: number;
  }[];
  productionTime: number; // 생산 소요 시간 (초 단위)
  requiredTechLevel: number; // 필요 기술 수준
}

// 게임 내 레시피 목록
export const recipes: Recipe[] = [
  {
    id: 'steel_production',
    name: '철강 생산',
    output: {
      resourceId: 'steel',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'iron_ore',
        amount: 2
      }
    ],
    productionTime: 5,
    requiredTechLevel: 1
  },
  {
    id: 'plastic_production',
    name: '플라스틱 생산',
    output: {
      resourceId: 'plastic',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'crude_oil',
        amount: 1.5
      }
    ],
    productionTime: 4,
    requiredTechLevel: 1
  },
  {
    id: 'fabric_production',
    name: '직물 생산',
    output: {
      resourceId: 'fabric',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'cotton',
        amount: 2
      }
    ],
    productionTime: 3,
    requiredTechLevel: 1
  },
  {
    id: 'smartphone_production',
    name: '스마트폰 생산',
    output: {
      resourceId: 'smartphone',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'plastic',
        amount: 0.5
      },
      {
        resourceId: 'steel',
        amount: 0.2
      }
    ],
    productionTime: 8,
    requiredTechLevel: 3
  },
  {
    id: 'furniture_production',
    name: '가구 생산',
    output: {
      resourceId: 'furniture',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'wood',
        amount: 3
      },
      {
        resourceId: 'steel',
        amount: 0.5
      }
    ],
    productionTime: 6,
    requiredTechLevel: 1
  },
  {
    id: 'clothing_production',
    name: '의류 생산',
    output: {
      resourceId: 'clothing',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'fabric',
        amount: 2
      }
    ],
    productionTime: 4,
    requiredTechLevel: 1
  },
  {
    id: 'car_production',
    name: '자동차 생산',
    output: {
      resourceId: 'car',
      amount: 1
    },
    inputs: [
      {
        resourceId: 'steel',
        amount: 5
      },
      {
        resourceId: 'plastic',
        amount: 3
      },
      {
        resourceId: 'fabric',
        amount: 2
      }
    ],
    productionTime: 12,
    requiredTechLevel: 2
  }
]; 