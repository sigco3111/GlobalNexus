'use client';

/**
 * 게임 상태 커스텀 훅
 * 컴포넌트에서 게임 상태를 쉽게 사용할 수 있게 해주는 훅입니다.
 */
import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/context/gameStore';
import { shallow } from 'zustand/shallow';
import { NotificationType } from '@/types/gameState';

/**
 * 게임 플레이어 정보를 가져오는 훅
 * @returns 플레이어 정보 및 관련 액션
 */
export function usePlayerInfo() {
  const player = useGameStore((state) => state.player, shallow);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const setCompanyName = useGameStore((state) => state.setCompanyName);
  const setReputation = useGameStore((state) => state.setReputation);
  const addMoney = useGameStore((state) => state.addMoney);
  const subtractMoney = useGameStore((state) => state.subtractMoney);
  
  return {
    ...player,
    setPlayerName,
    setCompanyName,
    setReputation,
    addMoney,
    subtractMoney
  };
}

/**
 * 게임 진행 상태를 가져오는 훅
 * @returns 게임 진행 상태 및 관련 액션
 */
export function useGameProgress() {
  const progress = useGameStore((state) => state.progress, shallow);
  const incrementDay = useGameStore((state) => state.incrementDay);
  const startGame = useGameStore((state) => state.startGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const setGameSpeed = useGameStore((state) => state.setGameSpeed);
  
  return {
    ...progress,
    incrementDay,
    startGame,
    pauseGame,
    resumeGame,
    setGameSpeed
  };
}

/**
 * 지역 데이터를 가져오는 훅
 * @param regionId 특정 지역 ID (선택적)
 * @returns 지역 정보 및 관련 액션
 */
export function useRegions(regionId?: string) {
  const regions = useGameStore((state) => state.regions, shallow);
  const addRegionInfluence = useGameStore((state) => state.addRegionInfluence);
  const setRegionRelationLevel = useGameStore((state) => state.setRegionRelationLevel);
  const investInRegion = useGameStore((state) => state.investInRegion);
  
  // 특정 지역 정보 메모이제이션
  const region = useMemo(() => {
    if (!regionId) return null;
    return regions.find(r => r.regionId === regionId) || null;
  }, [regions, regionId]);
  
  return {
    regions,
    region,
    addRegionInfluence,
    setRegionRelationLevel,
    investInRegion
  };
}

/**
 * 시설 데이터를 가져오는 훅
 * @param facilityId 특정 시설 ID (선택적)
 * @returns 시설 정보 및 관련 액션
 */
export function useFacilities(facilityId?: string) {
  const facilities = useGameStore((state) => state.facilities, shallow);
  const addFacility = useGameStore((state) => state.addFacility);
  const upgradeFacility = useGameStore((state) => state.upgradeFacility);
  const removeFacility = useGameStore((state) => state.removeFacility);
  
  // 특정 시설 정보 메모이제이션
  const facility = useMemo(() => {
    if (!facilityId) return null;
    return facilities.find(f => f.id === facilityId) || null;
  }, [facilities, facilityId]);
  
  return {
    facilities,
    facility,
    addFacility,
    upgradeFacility,
    removeFacility
  };
}

/**
 * 자원 데이터를 가져오는 훅
 * @param locationId 특정 위치 ID (선택적)
 * @returns 자원 정보 및 관련 액션
 */
export function useInventory(locationId?: string) {
  const inventory = useGameStore((state) => state.inventory, shallow);
  const addResource = useGameStore((state) => state.addResource);
  const removeResource = useGameStore((state) => state.removeResource);
  const transferResource = useGameStore((state) => state.transferResource);
  
  // 특정 위치의 자원 메모이제이션
  const locationInventory = useMemo(() => {
    if (!locationId) return inventory;
    return inventory.filter(item => item.locationId === locationId);
  }, [inventory, locationId]);
  
  return {
    inventory,
    locationInventory,
    addResource,
    removeResource,
    transferResource
  };
}

/**
 * 제품 데이터를 가져오는 훅
 * @param productId 특정 제품 ID (선택적)
 * @returns 제품 정보 및 관련 액션
 */
export function useProducts(productId?: string) {
  const products = useGameStore((state) => state.products, shallow);
  const addProduct = useGameStore((state) => state.addProduct);
  const updateProductPrice = useGameStore((state) => state.updateProductPrice);
  const updateProductAdvertising = useGameStore((state) => state.updateProductAdvertising);
  
  // 특정 제품 정보 메모이제이션
  const product = useMemo(() => {
    if (!productId) return null;
    return products.find(p => p.id === productId) || null;
  }, [products, productId]);
  
  return {
    products,
    product,
    addProduct,
    updateProductPrice,
    updateProductAdvertising
  };
}

/**
 * 회사 데이터를 가져오는 훅
 * @param companyId 특정 회사 ID (선택적)
 * @returns 회사 정보 및 관련 액션
 */
export function useCompanies(companyId?: string) {
  const companies = useGameStore((state) => state.companies, shallow);
  const addCompany = useGameStore((state) => state.addCompany);
  const buyCompanyShares = useGameStore((state) => state.buyCompanyShares);
  const sellCompanyShares = useGameStore((state) => state.sellCompanyShares);
  
  // 특정 회사 정보 메모이제이션
  const company = useMemo(() => {
    if (!companyId) return null;
    return companies.find(c => c.id === companyId) || null;
  }, [companies, companyId]);
  
  return {
    companies,
    company,
    addCompany,
    buyCompanyShares,
    sellCompanyShares
  };
}

/**
 * 연구 데이터를 가져오는 훅
 * @param techId 특정 기술 ID (선택적)
 * @returns 연구 정보 및 관련 액션
 */
export function useResearch(techId?: string) {
  const research = useGameStore((state) => state.research, shallow);
  const startResearch = useGameStore((state) => state.startResearch);
  const addResearchProgress = useGameStore((state) => state.addResearchProgress);
  const completeResearch = useGameStore((state) => state.completeResearch);
  
  // 특정 기술 정보 메모이제이션
  const tech = useMemo(() => {
    if (!techId) return null;
    return research.find(t => t.id === techId) || null;
  }, [research, techId]);
  
  return {
    research,
    tech,
    startResearch,
    addResearchProgress,
    completeResearch
  };
}

/**
 * 알림 데이터를 가져오는 훅
 * @param onlyUnread 읽지 않은 알림만 가져올지 여부
 * @returns 알림 정보 및 관련 액션
 */
export function useNotifications(onlyUnread = false) {
  const notifications = useGameStore((state) => state.notifications, shallow);
  const addNotification = useGameStore((state) => state.addNotification);
  const markNotificationAsRead = useGameStore((state) => state.markNotificationAsRead);
  const clearNotifications = useGameStore((state) => state.clearNotifications);
  
  // 읽지 않은 알림만 필터링
  const filteredNotifications = useMemo(() => {
    if (!onlyUnread) return notifications;
    return notifications.filter(n => !n.read);
  }, [notifications, onlyUnread]);
  
  return {
    notifications: filteredNotifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    unreadCount: filteredNotifications.length
  };
}

/**
 * 이벤트 데이터를 가져오는 훅
 * @param onlyActive 활성화된 이벤트만 가져올지 여부
 * @returns 이벤트 정보 및 관련 액션
 */
export function useEvents(onlyActive = true) {
  const events = useGameStore((state) => state.events, shallow);
  const addEvent = useGameStore((state) => state.addEvent);
  const resolveEvent = useGameStore((state) => state.resolveEvent);
  
  // 활성화된 이벤트만 필터링
  const filteredEvents = useMemo(() => {
    if (!onlyActive) return events;
    return events.filter(e => e.isActive);
  }, [events, onlyActive]);
  
  return {
    events: filteredEvents,
    addEvent,
    resolveEvent,
    activeCount: filteredEvents.length
  };
}

/**
 * 게임 전체 상태를 리셋하는 훅
 * @returns 게임 리셋 함수
 */
export function useResetGame() {
  const resetGame = useGameStore((state) => state.resetGame);
  return { resetGame };
} 