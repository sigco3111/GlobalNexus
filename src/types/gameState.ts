/**
 * 게임 상태 관련 타입 정의
 * 게임의 모든 상태 관련 타입을 정의합니다.
 */

// 플레이어 기본 정보 타입
export interface PlayerInfo {
  name: string;        // 플레이어 이름
  companyName: string; // 회사 이름
  money: number;       // 보유 자금
  reputation: number;  // 평판
}

// 게임 설정 타입
export interface GameSettings {
  difficulty: 'easy' | 'normal' | 'hard'; // 난이도
  startYear: number;                      // 시작 연도
  startMonth: number;                     // 시작 월
}

// 게임 진행 상태 타입
export interface GameProgress {
  day: number;          // 현재 일수
  isGameStarted: boolean; // 게임 시작 여부
  isPaused: boolean;      // 일시 정지 여부
  gameSpeed: number;      // 게임 속도 (1: 일반, 2: 빠름, 3: 매우 빠름)
  currentDate: Date;      // 현재 게임 내 날짜
}

// 지역 영향력 타입
export interface RegionInfluence {
  regionId: string;    // 지역 ID
  influence: number;   // 영향력 (0-100)
  relationLevel: number; // 관계 수준 (0-5)
  investment: number;  // 투자 금액
}

// 생산 시설 타입
export enum FacilityType {
  EXTRACTION = 'EXTRACTION',       // 채취 시설
  PROCESSING = 'PROCESSING',       // 가공 시설
  MANUFACTURING = 'MANUFACTURING', // 제조 시설
  LOGISTICS = 'LOGISTICS'          // 물류 시설
}

// 생산 시설 정보 타입
export interface Facility {
  id: string;           // 시설 ID
  name: string;         // 시설 명
  type: FacilityType;   // 시설 유형
  regionId: string;     // 위치 지역 ID
  level: number;        // 시설 레벨
  efficiency: number;   // 효율성 (0-1)
  capacity: number;     // 생산 용량
  maintenanceCost: number; // 유지 비용
  operatingCost: number;   // 운영 비용
  resourcesProcessed: string[]; // 처리 가능한 자원 ID 목록
}

// 보유 자원 타입
export interface ResourceInventory {
  resourceId: string;   // 자원 ID
  amount: number;       // 보유량
  quality: number;      // 품질 (0-1)
  locationId: string;   // 보관 위치 ID (지역 또는 시설)
}

// 제품 정보 타입
export interface ProductInfo {
  id: string;            // 제품 ID
  name: string;          // 제품 명
  price: number;         // 판매 가격
  quality: number;       // 품질 (0-1)
  advertisingLevel: number; // 광고 수준 (0-5)
  marketShare: number;      // 시장 점유율 (0-1)
}

// 회사 정보 타입
export interface CompanyInfo {
  id: string;            // 회사 ID
  name: string;          // 회사 명
  value: number;         // 회사 가치
  sharesOutstanding: number; // 발행 주식 수
  ownedShares: number;       // 보유 주식 수
  sharePrice: number;        // 주가
  isSubsidiary: boolean;     // 자회사 여부
  parentCompanyId?: string;  // 모회사 ID (있는 경우)
}

// 연구 기술 타입
export interface ResearchTech {
  id: string;            // 기술 ID
  name: string;          // 기술 명
  level: number;         // 연구 레벨
  progress: number;      // 연구 진행도 (0-1)
  cost: number;          // 연구 비용
  benefitDescription: string; // 혜택 설명
  isActive: boolean;     // 활성화 여부
}

// 알림 타입
export enum NotificationType {
  INFO = 'INFO',         // 정보
  WARNING = 'WARNING',   // 경고
  SUCCESS = 'SUCCESS',   // 성공
  ERROR = 'ERROR',       // 오류
  EVENT = 'EVENT'        // 이벤트
}

// 알림 정보 타입
export interface Notification {
  id: string;            // 알림 ID
  type: NotificationType; // 알림 유형
  title: string;          // 제목
  message: string;        // 내용
  date: Date;             // 발생 일시
  read: boolean;          // 읽음 여부
  relatedId?: string;     // 관련 객체 ID (있는 경우)
}

// 게임 이벤트 타입
export interface GameEvent {
  id: string;            // 이벤트 ID
  title: string;         // 제목
  description: string;   // 설명
  options: GameEventOption[]; // 선택 옵션 목록
  startDate: Date;       // 시작 일시
  endDate: Date;         // 종료 일시
  isActive: boolean;     // 활성화 여부
  isResolved: boolean;   // 해결 여부
}

// 게임 이벤트 옵션 타입
export interface GameEventOption {
  id: string;            // 옵션 ID
  description: string;   // 설명
  consequences: string;  // 결과 설명
  effect: any;           // 효과 (함수 또는 객체)
}

// 전체 게임 상태 타입
export interface GameStateType {
  player: PlayerInfo;               // 플레이어 정보
  settings: GameSettings;           // 게임 설정
  progress: GameProgress;           // 게임 진행 상태
  regions: RegionInfluence[];       // 지역 영향력 목록
  facilities: Facility[];           // 생산 시설 목록
  inventory: ResourceInventory[];   // 보유 자원 목록
  products: ProductInfo[];          // 제품 정보 목록
  companies: CompanyInfo[];         // 회사 정보 목록
  research: ResearchTech[];         // 연구 기술 목록
  notifications: Notification[];    // 알림 목록
  events: GameEvent[];              // 이벤트 목록
} 