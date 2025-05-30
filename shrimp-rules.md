# 개발 가이드라인

## 1. 프로젝트 개요

### 목적 및 핵심 컨셉
- 웹 기반 경영 시뮬레이션 게임 개발
- 전 세계의 물리적/디지털 특산물 및 인재를 활용한 제품 생산과 유통
- 주식 시장에서 경쟁사 인수합병을 통한 글로벌 복합 기업 건설
- **완전한 서버리스 아키텍처**로 브라우저에서 직접 구동
- **전체 화면의 부드러운 렌더링을 위한 더블 버퍼링 기법 활용**

### 기술 스택
- **프론트엔드:** React, Next.js, TypeScript
- **데이터 시각화:** D3.js (SVG 데이터 처리 및 Canvas 그리기)
- **스타일링:** Tailwind CSS
- **상태 관리:** Zustand 또는 React Context API
- **게임 로직:** 커스텀 JavaScript 게임 루프 (requestAnimationFrame 기반)
- **데이터 저장:** Browser의 localStorage 또는 필요시 IndexedDB
- **세계 지도:** [simple-world-map](https://github.com/flekschas/simple-world-map) SVG 데이터 활용

## 2. 프로젝트 아키텍처

### 디렉토리 구조
- **/src**
  - **/components** - UI 컴포넌트 (지도, 패널, 대시보드 등)
  - **/hooks** - 커스텀 훅 (상태 관리, 데이터 로딩, 게임 로직 등)
  - **/context** - 상태 관리 (전역 게임 상태, 사용자 설정 등)
  - **/utils** - 유틸리티 함수 (계산, 포맷팅, 헬퍼 함수 등)
  - **/styles** - 스타일 관련 파일 (Tailwind 구성, 글로벌 스타일 등)
  - **/data** - 정적 게임 데이터 (지역 정보, 제품 레시피, 회사 목록 등)
  - **/systems** - 주요 게임 시스템 (생산, 시장, 주식 등)
  - **/pages** - Next.js 페이지 컴포넌트
  - **/types** - TypeScript 타입 정의
- **/public** - 정적 자산 (이미지, 아이콘, 폰트 등)
- **/docs** - 문서 (PRD, 기술 문서 등)

### 핵심 모듈 구분
- **worldMap** - 세계 지도 렌더링 및 지역 데이터 관리
- **productionSystem** - 자원 채취, 제품 생산, 공급망 관리
- **marketSystem** - 제품 판매, 시장 점유율, 경쟁 분석
- **stockMarket** - 주식 거래, 인수합병 메커니즘
- **financialSystem** - 재정 관리, 수익/비용 계산, 대출
- **ceoSystem** - CEO 임명 및 위임 경영

## 3. 코드 표준

### 명명 규칙
- **컴포넌트:** PascalCase (예: WorldMap.tsx, ProductionPanel.tsx)
- **훅:** camelCase, use 접두사 사용 (예: useGameState.ts, useWorldMap.ts)
- **유틸리티 함수:** camelCase (예: calculateProfit.ts, formatCurrency.ts)
- **상수:** 대문자 및 언더스코어 (예: MAX_PRODUCTION_CAPACITY, DEFAULT_INTEREST_RATE)
- **불리언 변수:** is, has, can 접두사 사용 (예: isProducing, hasResource, canBuyStock)

### 파일 구조
- 한 파일에는 하나의 주요 기능만 정의
- 관련 기능은 동일한 디렉토리에 그룹화
- 외부 의존성이 높은 코드는 별도 파일로 분리 (API 호출, 데이터 로딩 등)

### 주석 규칙
- **필수:** 모든 함수와 주요 로직 상단에 간단한 설명 추가
- **필수:** 복잡한 로직에 주석으로 설명 추가
- **필수:** 한국어로 주석 작성
- **금지:** 불필요하거나 과도한 주석 (자명한 코드에는 주석 불필요)

### 예시
```typescript
/**
 * 지역의 자원 생산량을 계산하는 함수
 * 지역의 영향력과 시설 레벨에 따라 생산량이 결정됨
 */
const calculateResourceProduction = (
  region: Region,
  facilityLevel: number,
  influenceLevel: number
): number => {
  // 기본 생산량 설정
  const baseProduction = RESOURCE_BASE_PRODUCTION[region.type];
  
  // 영향력과 시설 레벨에 따른 보너스 계산
  const influenceBonus = influenceLevel * INFLUENCE_MULTIPLIER;
  const facilityBonus = Math.pow(FACILITY_GROWTH_RATE, facilityLevel - 1);
  
  // 최종 생산량 계산 및 반환
  return baseProduction * (1 + influenceBonus) * facilityBonus;
};
```

## 4. 기능 구현 표준

### SVG 세계 지도 및 렌더링
- **필수:** Canvas와 더블 버퍼링 기법을 사용하여 지도 렌더링
- **필수:** simple-world-map의 SVG 데이터를 D3.js로 처리하여 Canvas에 그리기
- **필수:** 지역 클릭/호버 이벤트 처리를 위한 히트맵 구현
- **필수:** 지도 상에 시설물, 영향력 수준 등을 오버레이로 표시
- **금지:** DOM 기반 SVG 직접 렌더링 (성능 이슈)

### 지역 관리 시스템
- **필수:** 각 지역별 물리적/디지털 특산물 데이터 구현
- **필수:** 지역 영향력 시스템 구현 (투자, 로비, 개발 등)
- **필수:** 자원 채취 시설 건설 및 관리 기능
- **필수:** 물류 허브 시스템 구현 (자동 운송 효율화)

### 제품 생산 및 공급망
- **필수:** 레시피 기반 생산 시스템 구현 (원자재-중간재-최종제품)
- **필수:** 자동 운송 시스템 구현 (거리에 따른 시간/비용 계산)
- **필수:** 생산 시설 관리 (공장, 개발 스튜디오, 데이터 센터 등)
- **금지:** 수동 운송 관리 또는 창고 시스템 구현 (불필요한 복잡성)

### 시장 경쟁 및 점유율
- **필수:** 품질, 가격, 홍보 요소 기반 시장 점유율 계산 시스템
- **필수:** 경쟁사 AI 구현 (제품 전략, 가격 결정 등)
- **필수:** 시장 분석 및 시각화 도구 (그래프, 차트 등)

### 주식 거래 및 인수합병
- **필수:** 20개 회사의 주식 거래 시스템 구현
- **필수:** 실시간 주가 변동 시스템 (회사 실적, 시장 상황 반영)
- **필수:** 지분 51% 이상 확보 시 자동 인수 처리
- **필수:** 인수 후 자산 통합 시스템 구현
- **금지:** 별도의 금융 미니게임 구현 (주식 매수만으로 인수 가능)

### CEO 임명 및 위임 경영
- **필수:** 모회사 및 자회사에 CEO 임명 기능
- **필수:** CEO 위임 시 자동 최적화 알고리즘 구현
- **필수:** 정기적인 성과 보고 시스템
- **금지:** CEO별 차별화된 능력치 구현 (모든 CEO는 동일 능력)

## 5. 외부 라이브러리 사용 표준

### React/Next.js
- **필수:** 함수형 컴포넌트와 훅 사용
- **필수:** Next.js의 정적 생성 및 서버 사이드 렌더링 활용
- **필수:** 게임 UI와 컨트롤을 위한 React 컴포넌트 구현
- **금지:** 클래스 컴포넌트 사용

### TypeScript
- **필수:** 모든 데이터 구조와 함수에 타입 명시
- **필수:** 인터페이스와 타입 별칭을 사용한 명확한 타입 정의
- **필수:** 게임 엔티티의 타입 정의 (Region, Resource, Product 등)
- **금지:** any 타입 사용 (특별한 경우 제외)

### D3.js
- **필수:** SVG 데이터 처리 및 Canvas 그리기에만 사용
- **필수:** 데이터 시각화 (차트, 그래프)에 활용
- **금지:** DOM 조작에 직접 사용 (React와 충돌 가능성)

### Tailwind CSS
- **필수:** 유틸리티 클래스를 활용한 일관된 UI 스타일링
- **필수:** 반응형 디자인 구현
- **금지:** 인라인 스타일 또는 CSS-in-JS 사용

### Zustand/React Context API
- **필수:** 전역 게임 상태 관리에 활용
- **필수:** 주요 시스템별 상태 분리 (지도, 생산, 시장, 주식 등)
- **금지:** 과도한 상태 중앙화 (필요한 경우만 전역 상태 사용)

### simple-world-map
- **필수:** SVG 세계 지도 데이터 소스로만 활용
- **필수:** D3.js와 함께 Canvas 렌더링에 활용
- **금지:** 직접적인 DOM 기반 SVG 렌더링에 사용

## 6. 작업 흐름 표준

### 게임 루프 구현
- **필수:** requestAnimationFrame 기반 게임 루프 구현
- **필수:** 더블 버퍼링을 통한 전체 화면 렌더링
- **필수:** 프레임 레이트 관리 및 최적화
- **금지:** 직접적인 DOM 조작을 통한 애니메이션

### 데이터 흐름
- **필수:** 단방향 데이터 흐름 유지 (상태 → 렌더링 → 이벤트 → 상태)
- **필수:** 불변성 유지 (상태 직접 수정 금지)
- **필수:** 필요한 경우에만 상태 업데이트 (불필요한 리렌더링 방지)
- **금지:** 양방향 바인딩 또는 직접 상태 수정

### 저장 및 로드
- **필수:** localStorage를 활용한 게임 상태 저장
- **필수:** 필요 시 IndexedDB로 대용량 데이터 처리
- **필수:** 자동 저장 및 수동 저장 기능 구현
- **금지:** 서버 측 저장소 사용 (완전한 서버리스 아키텍처)

## 7. 주요 파일 상호작용 표준

### 세계 지도 관련 파일
- **/data/worldMap.ts**: 지역 데이터 정의
- **/components/WorldMap.tsx**: 지도 렌더링 컴포넌트
- **/hooks/useWorldMap.ts**: 지도 상태 및 상호작용 로직
- **/systems/region/RegionManager.ts**: 지역 관리 시스템

### 제품 및 생산 관련 파일
- **/data/resources.ts**: 원자재 및 특산물 정의
- **/data/recipes.ts**: 제품 레시피 정의
- **/components/ProductionPanel.tsx**: 생산 관리 UI
- **/systems/production/ProductionManager.ts**: 생산 시스템

### 시장 및 경쟁 관련 파일
- **/data/markets.ts**: 시장 정의 및 초기 점유율
- **/components/MarketAnalysis.tsx**: 시장 분석 UI
- **/systems/market/MarketManager.ts**: 시장 경쟁 시스템

### 주식 및 인수합병 관련 파일
- **/data/companies.ts**: 회사 정의 및 초기 주가
- **/components/StockMarket.tsx**: 주식 거래 UI
- **/systems/stock/StockManager.ts**: 주식 시장 시스템

## 8. AI 의사결정 표준

### 우선순위 판단
1. **사용자 경험 최우선**: 렌더링 성능과 반응성 우선
2. **시스템 일관성**: 모든 시스템이 일관된 규칙으로 작동
3. **확장성**: 기능 추가 및 수정이 용이한 구조
4. **코드 가독성**: 명확하고 이해하기 쉬운 코드 작성

### 애매한 상황 처리
- **렌더링 방식 선택**: Canvas가 성능 면에서 우선, 정적 UI는 DOM 사용
- **상태 관리 위치**: 전역적으로 필요한 상태만 Zustand/Context에서 관리, 나머지는 지역 상태
- **게임 밸런싱**: PRD에 명시된 게임 흐름과 난이도를 기준으로 판단

## 9. 금지 사항

### 아키텍처 관련
- **서버 의존성 추가**: 완전한 서버리스 구조를 유지해야 함
- **DOM 기반 SVG 직접 렌더링**: 성능 저하를 방지하기 위해 Canvas로 처리
- **과도한 상태 중앙화**: 필요한 경우에만 전역 상태 사용

### 게임 메커니즘 관련
- **수동 운송 관리**: 운송은 자동으로 처리되어야 함
- **창고 시스템 구현**: 불필요한 복잡성을 줄이기 위해 창고 시스템 없음
- **CEO 능력치 차별화**: 모든 CEO의 능력치는 동일해야 함
- **금융 미니게임 추가**: 주식 매수만으로 인수가 가능해야 함

### 코드 품질 관련
- **any 타입 사용**: 명확한 타입 정의 필요
- **인라인 스타일**: Tailwind CSS 유틸리티 클래스 사용
- **과도한 주석**: 필요한 경우에만 주석 추가
- **클래스 컴포넌트**: 함수형 컴포넌트와 훅 사용 