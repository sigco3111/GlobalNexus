'use client';

/**
 * 게임 상태 테스트 컴포넌트
 * 게임 상태 관리 시스템 테스트를 위한 컴포넌트입니다.
 */
import React, { useState } from 'react';
import { usePlayerInfo, useGameProgress, useNotifications } from '@/hooks/useGameState';
import { NotificationType } from '@/types/gameState';

const GameStateTest: React.FC = () => {
  // 플레이어 정보 및 게임 진행 상태 가져오기
  const { name, companyName, money, setPlayerName, setCompanyName, addMoney, subtractMoney } = usePlayerInfo();
  const { day, isGameStarted, isPaused, gameSpeed, startGame, pauseGame, resumeGame, setGameSpeed, incrementDay } = useGameProgress();
  const { notifications, addNotification, markNotificationAsRead, unreadCount } = useNotifications();
  
  // 폼 상태
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [moneyAmount, setMoneyAmount] = useState(1000);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // 플레이어 이름 설정 핸들러
  const handleSetPlayerName = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerNameInput.trim()) {
      setPlayerName(playerNameInput.trim());
      setPlayerNameInput('');
      
      // 알림 추가
      addNotification(
        NotificationType.SUCCESS, 
        '플레이어 이름 변경', 
        `플레이어 이름이 '${playerNameInput.trim()}'으로 변경되었습니다.`
      );
    }
  };
  
  // 회사 이름 설정 핸들러
  const handleSetCompanyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyNameInput.trim()) {
      setCompanyName(companyNameInput.trim());
      setCompanyNameInput('');
      
      // 알림 추가
      addNotification(
        NotificationType.SUCCESS, 
        '회사 이름 변경', 
        `회사 이름이 '${companyNameInput.trim()}'으로 변경되었습니다.`
      );
    }
  };
  
  // 돈 추가 핸들러
  const handleAddMoney = () => {
    if (moneyAmount > 0) {
      addMoney(moneyAmount);
      
      // 알림 추가
      addNotification(
        NotificationType.INFO, 
        '자금 증가', 
        `${moneyAmount}원이 추가되었습니다.`
      );
    }
  };
  
  // 돈 차감 핸들러
  const handleSubtractMoney = () => {
    if (moneyAmount > 0 && money >= moneyAmount) {
      subtractMoney(moneyAmount);
      
      // 알림 추가
      addNotification(
        NotificationType.WARNING, 
        '자금 감소', 
        `${moneyAmount}원이 차감되었습니다.`
      );
    } else if (money < moneyAmount) {
      // 에러 알림
      addNotification(
        NotificationType.ERROR, 
        '자금 부족', 
        `차감할 금액(${moneyAmount}원)이 현재 보유 자금(${money}원)보다 많습니다.`
      );
    }
  };
  
  // 알림 추가 핸들러
  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationTitle.trim() && notificationMessage.trim()) {
      addNotification(
        NotificationType.INFO,
        notificationTitle.trim(),
        notificationMessage.trim()
      );
      setNotificationTitle('');
      setNotificationMessage('');
    }
  };
  
  // 게임 속도 문자열 변환
  const getGameSpeedText = (speed: number) => {
    switch (speed) {
      case 1: return '일반';
      case 2: return '빠름';
      case 3: return '매우 빠름';
      default: return '일반';
    }
  };
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">게임 상태 테스트</h1>
      
      {/* 플레이어 정보 섹션 */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-3">플레이어 정보</h2>
        <div className="space-y-2">
          <p><span className="font-medium">플레이어 이름:</span> {name || '(미설정)'}</p>
          <p><span className="font-medium">회사 이름:</span> {companyName || '(미설정)'}</p>
          <p><span className="font-medium">보유 자금:</span> {money.toLocaleString()}원</p>
        </div>
        
        {/* 플레이어 이름 설정 폼 */}
        <form onSubmit={handleSetPlayerName} className="mt-4 flex space-x-2">
          <input
            type="text"
            value={playerNameInput}
            onChange={(e) => setPlayerNameInput(e.target.value)}
            placeholder="플레이어 이름"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            이름 설정
          </button>
        </form>
        
        {/* 회사 이름 설정 폼 */}
        <form onSubmit={handleSetCompanyName} className="mt-2 flex space-x-2">
          <input
            type="text"
            value={companyNameInput}
            onChange={(e) => setCompanyNameInput(e.target.value)}
            placeholder="회사 이름"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            이름 설정
          </button>
        </form>
        
        {/* 돈 관리 */}
        <div className="mt-4 flex space-x-2">
          <input
            type="number"
            value={moneyAmount}
            onChange={(e) => setMoneyAmount(parseInt(e.target.value) || 0)}
            min="0"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddMoney}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            돈 추가
          </button>
          <button
            onClick={handleSubtractMoney}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            돈 차감
          </button>
        </div>
      </div>
      
      {/* 게임 진행 상태 섹션 */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-3">게임 진행 상태</h2>
        <div className="space-y-2">
          <p><span className="font-medium">현재 일수:</span> {day}일</p>
          <p><span className="font-medium">게임 상태:</span> {isGameStarted ? (isPaused ? '일시정지' : '진행 중') : '대기 중'}</p>
          <p><span className="font-medium">게임 속도:</span> {getGameSpeedText(gameSpeed)} (x{gameSpeed})</p>
        </div>
        
        {/* 게임 제어 버튼 */}
        <div className="mt-4 flex space-x-2">
          {!isGameStarted ? (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              게임 시작
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeGame}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              게임 재개
            </button>
          ) : (
            <button
              onClick={pauseGame}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              일시정지
            </button>
          )}
          
          <button
            onClick={incrementDay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            일수 증가
          </button>
        </div>
        
        {/* 게임 속도 설정 */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => setGameSpeed(1)}
            className={`px-4 py-2 rounded ${gameSpeed === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            일반 (x1)
          </button>
          <button
            onClick={() => setGameSpeed(2)}
            className={`px-4 py-2 rounded ${gameSpeed === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            빠름 (x2)
          </button>
          <button
            onClick={() => setGameSpeed(3)}
            className={`px-4 py-2 rounded ${gameSpeed === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            매우 빠름 (x3)
          </button>
        </div>
      </div>
      
      {/* 알림 섹션 */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-3">
          알림 
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        
        {/* 알림 추가 폼 */}
        <form onSubmit={handleAddNotification} className="mb-4 space-y-2">
          <input
            type="text"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            placeholder="알림 제목"
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="알림 내용"
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            알림 추가
          </button>
        </form>
        
        {/* 알림 목록 */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 italic">알림이 없습니다.</p>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 rounded border-l-4 ${
                  notification.type === NotificationType.SUCCESS ? 'border-green-500 bg-green-50' :
                  notification.type === NotificationType.ERROR ? 'border-red-500 bg-red-50' :
                  notification.type === NotificationType.WARNING ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                } ${notification.read ? 'opacity-70' : ''}`}
                onClick={() => markNotificationAsRead(notification.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-xs text-gray-500">
                    {notification.date.toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1 text-sm">{notification.message}</p>
                {!notification.read && (
                  <div className="mt-1 text-xs text-blue-600">클릭하여 읽음 표시</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStateTest; 