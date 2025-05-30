'use client';

/**
 * 게임 상태 관리 스토어
 * Zustand를 사용하여 전역 게임 상태를 관리합니다.
 */
import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  GameStateType, 
  PlayerInfo, 
  GameSettings, 
  GameProgress,
  RegionInfluence,
  Facility,
  ResourceInventory,
  ProductInfo,
  CompanyInfo,
  ResearchTech,
  Notification,
  GameEvent,
  NotificationType
} from '@/types/gameState';

// 게임 상태 변경 함수 타입
export interface GameStateActions {
  // 플레이어 관련 액션
  setPlayerName: (name: string) => void;
  setCompanyName: (name: string) => void;
  setReputation: (reputation: number) => void;
  addMoney: (amount: number) => void;
  subtractMoney: (amount: number) => void;
  
  // 게임 진행 관련 액션
  incrementDay: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setGameSpeed: (speed: number) => void;
  
  // 지역 관련 액션
  addRegionInfluence: (regionId: string, amount: number) => void;
  setRegionRelationLevel: (regionId: string, level: number) => void;
  investInRegion: (regionId: string, amount: number) => void;
  
  // 시설 관련 액션
  addFacility: (facility: Omit<Facility, 'id'>) => void;
  upgradeFacility: (facilityId: string) => void;
  removeFacility: (facilityId: string) => void;
  
  // 자원 관련 액션
  addResource: (resourceId: string, amount: number, quality: number, locationId: string) => void;
  removeResource: (resourceId: string, amount: number, locationId: string) => void;
  transferResource: (resourceId: string, amount: number, fromLocationId: string, toLocationId: string) => void;
  
  // 제품 관련 액션
  addProduct: (product: Omit<ProductInfo, 'id'>) => void;
  updateProductPrice: (productId: string, price: number) => void;
  updateProductAdvertising: (productId: string, level: number) => void;
  
  // 회사 관련 액션
  addCompany: (company: Omit<CompanyInfo, 'id'>) => void;
  buyCompanyShares: (companyId: string, amount: number) => void;
  sellCompanyShares: (companyId: string, amount: number) => void;
  
  // 연구 관련 액션
  startResearch: (techId: string) => void;
  addResearchProgress: (techId: string, progress: number) => void;
  completeResearch: (techId: string) => void;
  
  // 알림 관련 액션
  addNotification: (type: NotificationType, title: string, message: string, relatedId?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // 이벤트 관련 액션
  addEvent: (event: Omit<GameEvent, 'id'>) => void;
  resolveEvent: (eventId: string, optionId: string) => void;
  
  // 게임 상태 초기화
  resetGame: () => void;
}

// 전체 게임 상태 인터페이스
export interface GameStore extends GameStateType, GameStateActions {}

// 초기 게임 상태
const initialState: GameStateType = {
  player: {
    name: '',
    companyName: '',
    money: 10000,
    reputation: 50
  },
  settings: {
    difficulty: 'normal',
    startYear: 2024,
    startMonth: 1
  },
  progress: {
    day: 1,
    isGameStarted: false,
    isPaused: false,
    gameSpeed: 1,
    currentDate: new Date(2024, 0, 1) // 2024년 1월 1일
  },
  regions: [],
  facilities: [],
  inventory: [],
  products: [],
  companies: [],
  research: [],
  notifications: [],
  events: []
};

// Zustand 스토어 생성
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // 플레이어 관련 액션
        setPlayerName: (name) => set((state) => ({
          player: { ...state.player, name }
        })),
        
        setCompanyName: (name) => set((state) => ({
          player: { ...state.player, companyName: name }
        })),
        
        setReputation: (reputation) => set((state) => ({
          player: { ...state.player, reputation }
        })),
        
        addMoney: (amount) => set((state) => ({
          player: { ...state.player, money: state.player.money + amount }
        })),
        
        subtractMoney: (amount) => set((state) => ({
          player: { ...state.player, money: state.player.money - amount }
        })),
        
        // 게임 진행 관련 액션
        incrementDay: () => set((state) => {
          const currentDate = new Date(state.progress.currentDate);
          currentDate.setDate(currentDate.getDate() + 1);
          
          return {
            progress: {
              ...state.progress,
              day: state.progress.day + 1,
              currentDate
            }
          };
        }),
        
        startGame: () => set((state) => ({
          progress: {
            ...state.progress,
            isGameStarted: true,
            isPaused: false
          }
        })),
        
        pauseGame: () => set((state) => ({
          progress: {
            ...state.progress,
            isPaused: true
          }
        })),
        
        resumeGame: () => set((state) => ({
          progress: {
            ...state.progress,
            isPaused: false
          }
        })),
        
        setGameSpeed: (speed) => set((state) => ({
          progress: {
            ...state.progress,
            gameSpeed: speed
          }
        })),
        
        // 지역 관련 액션
        addRegionInfluence: (regionId, amount) => set((state) => {
          const regions = [...state.regions];
          const region = regions.find(r => r.regionId === regionId);
          
          if (region) {
            region.influence = Math.min(100, region.influence + amount);
          } else {
            regions.push({
              regionId,
              influence: amount,
              relationLevel: 1,
              investment: 0
            });
          }
          
          return { regions };
        }),
        
        setRegionRelationLevel: (regionId, level) => set((state) => {
          const regions = [...state.regions];
          const region = regions.find(r => r.regionId === regionId);
          
          if (region) {
            region.relationLevel = Math.min(5, Math.max(0, level));
          }
          
          return { regions };
        }),
        
        investInRegion: (regionId, amount) => set((state) => {
          const regions = [...state.regions];
          const region = regions.find(r => r.regionId === regionId);
          
          if (region) {
            region.investment += amount;
            region.influence = Math.min(100, region.influence + amount / 1000);
          }
          
          return { regions };
        }),
        
        // 시설 관련 액션
        addFacility: (facility) => set((state) => ({
          facilities: [...state.facilities, { ...facility, id: uuidv4() }]
        })),
        
        upgradeFacility: (facilityId) => set((state) => {
          const facilities = [...state.facilities];
          const facility = facilities.find(f => f.id === facilityId);
          
          if (facility) {
            facility.level += 1;
            facility.efficiency = Math.min(1, facility.efficiency + 0.05);
            facility.capacity = Math.floor(facility.capacity * 1.2);
            facility.maintenanceCost = Math.floor(facility.maintenanceCost * 1.1);
          }
          
          return { facilities };
        }),
        
        removeFacility: (facilityId) => set((state) => ({
          facilities: state.facilities.filter(f => f.id !== facilityId)
        })),
        
        // 자원 관련 액션
        addResource: (resourceId, amount, quality, locationId) => set((state) => {
          const inventory = [...state.inventory];
          const item = inventory.find(i => i.resourceId === resourceId && i.locationId === locationId);
          
          if (item) {
            // 기존 자원 업데이트
            const totalAmount = item.amount + amount;
            item.quality = (item.quality * item.amount + quality * amount) / totalAmount;
            item.amount = totalAmount;
          } else {
            // 새 자원 추가
            inventory.push({
              resourceId,
              amount,
              quality,
              locationId
            });
          }
          
          return { inventory };
        }),
        
        removeResource: (resourceId, amount, locationId) => set((state) => {
          const inventory = [...state.inventory];
          const item = inventory.find(i => i.resourceId === resourceId && i.locationId === locationId);
          
          if (item) {
            if (item.amount <= amount) {
              // 자원 전부 소모
              return {
                inventory: inventory.filter(i => i !== item)
              };
            } else {
              // 일부만 소모
              item.amount -= amount;
              return { inventory };
            }
          }
          
          return { inventory };
        }),
        
        transferResource: (resourceId, amount, fromLocationId, toLocationId) => {
          const state = get();
          const fromItem = state.inventory.find(
            i => i.resourceId === resourceId && i.locationId === fromLocationId
          );
          
          if (!fromItem || fromItem.amount < amount) return;
          
          // 원본 위치에서 자원 제거
          get().removeResource(resourceId, amount, fromLocationId);
          
          // 대상 위치에 자원 추가
          get().addResource(resourceId, amount, fromItem.quality, toLocationId);
        },
        
        // 제품 관련 액션
        addProduct: (product) => set((state) => ({
          products: [...state.products, { ...product, id: uuidv4() }]
        })),
        
        updateProductPrice: (productId, price) => set((state) => {
          const products = [...state.products];
          const product = products.find(p => p.id === productId);
          
          if (product) {
            product.price = price;
          }
          
          return { products };
        }),
        
        updateProductAdvertising: (productId, level) => set((state) => {
          const products = [...state.products];
          const product = products.find(p => p.id === productId);
          
          if (product) {
            product.advertisingLevel = Math.min(5, Math.max(0, level));
          }
          
          return { products };
        }),
        
        // 회사 관련 액션
        addCompany: (company) => set((state) => ({
          companies: [...state.companies, { ...company, id: uuidv4() }]
        })),
        
        buyCompanyShares: (companyId, amount) => set((state) => {
          const companies = [...state.companies];
          const company = companies.find(c => c.id === companyId);
          
          if (company) {
            company.ownedShares += amount;
          }
          
          return { companies };
        }),
        
        sellCompanyShares: (companyId, amount) => set((state) => {
          const companies = [...state.companies];
          const company = companies.find(c => c.id === companyId);
          
          if (company && company.ownedShares >= amount) {
            company.ownedShares -= amount;
          }
          
          return { companies };
        }),
        
        // 연구 관련 액션
        startResearch: (techId) => set((state) => {
          const research = [...state.research];
          const tech = research.find(t => t.id === techId);
          
          if (tech && !tech.isActive) {
            tech.isActive = true;
            tech.progress = 0;
          }
          
          return { research };
        }),
        
        addResearchProgress: (techId, progress) => set((state) => {
          const research = [...state.research];
          const tech = research.find(t => t.id === techId);
          
          if (tech && tech.isActive) {
            tech.progress = Math.min(1, tech.progress + progress);
          }
          
          return { research };
        }),
        
        completeResearch: (techId) => set((state) => {
          const research = [...state.research];
          const tech = research.find(t => t.id === techId);
          
          if (tech) {
            tech.isActive = false;
            tech.progress = 0;
            tech.level += 1;
          }
          
          return { research };
        }),
        
        // 알림 관련 액션
        addNotification: (type, title, message, relatedId) => set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: uuidv4(),
              type,
              title,
              message,
              date: new Date(),
              read: false,
              relatedId
            }
          ]
        })),
        
        markNotificationAsRead: (notificationId) => set((state) => {
          const notifications = [...state.notifications];
          const notification = notifications.find(n => n.id === notificationId);
          
          if (notification) {
            notification.read = true;
          }
          
          return { notifications };
        }),
        
        clearNotifications: () => set({ notifications: [] }),
        
        // 이벤트 관련 액션
        addEvent: (event) => set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: uuidv4(),
              isActive: true,
              isResolved: false
            }
          ]
        })),
        
        resolveEvent: (eventId, optionId) => set((state) => {
          const events = [...state.events];
          const event = events.find(e => e.id === eventId);
          
          if (event) {
            event.isActive = false;
            event.isResolved = true;
            
            // 선택한 옵션의 효과 실행
            const option = event.options.find(o => o.id === optionId);
            if (option && typeof option.effect === 'function') {
              option.effect(get());
            }
          }
          
          return { events };
        }),
        
        // 게임 상태 초기화
        resetGame: () => set(initialState),
      }),
      {
        name: 'global-nexus-game-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          player: state.player,
          settings: state.settings,
          progress: state.progress,
          regions: state.regions,
          facilities: state.facilities,
          inventory: state.inventory,
          products: state.products,
          companies: state.companies,
          research: state.research,
          // 알림과 이벤트는 저장하지 않음
        }),
      }
    )
  )
); 