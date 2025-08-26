import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import TimeSlotManager from '../../components/TimeSlotManager';
import AvailableTimeManager from '../../components/AvailableTimeManager';
import { TimeSlot } from '../../types';
import './Calendar.css';

function Calendar(): JSX.Element {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [showSettings, setShowSettings] = useState(false);

  // 일정별 색상 선택 (10개, RGB 값 다양화)
  const colorOptions = [
    '#FF6B6B', // 빨강
    '#4ECDC4', // 청록
    '#45B7D1', // 하늘색
    '#96CEB4', // 연두
    '#FECA57', // 노랑
    '#FF9FF3', // 분홍
    '#54A0FF', // 파랑
    '#5F27CD', // 보라
    '#00D2D3', // 청록
    '#FF9F43'  // 주황
  ];

  useEffect(() => {
    if (currentUser) {
      loadTimeSlots();
      loadAvailableSlots();
      loadAdditionalInfo();
      loadMonthTimeSlots();
    }
  }, [currentUser, selectedDate]);

  useEffect(() => {
    if (currentUser) {
      loadMonthTimeSlots();
    }
  }, [currentUser, selectedDate.getFullYear(), selectedDate.getMonth()]);

  // 전체 월 데이터 로드
  const loadMonthTimeSlots = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const timeSlotsRef = collection(db, 'timeSlots');
      const q = query(
        timeSlotsRef,
        where('hostId', '==', currentUser.uid),
        where('date', '>=', startDateStr),
        where('date', '<=', endDateStr)
      );
      
      const querySnapshot = await getDocs(q);
      const allSlots: TimeSlot[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.slots && Array.isArray(data.slots)) {
          data.slots.forEach((slot: any) => {
            allSlots.push({
              ...slot,
              date: data.date
            });
          });
        }
      });
      
      setAllTimeSlots(allSlots);
    } catch (error) {
      console.error('Error loading month time slots:', error);
    }
  };

  const loadTimeSlots = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const timeSlotsRef = doc(db, 'timeSlots', `${currentUser.uid}_${dateStr}`);
      const timeSlotDoc = await getDoc(timeSlotsRef);
      
      if (timeSlotDoc.exists()) {
        setTimeSlots(timeSlotDoc.data().slots || []);
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('시간대를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const availableSlotsRef = doc(db, 'availableSlots', `${currentUser.uid}_${dateStr}`);
      const availableSlotDoc = await getDoc(availableSlotsRef);
      
      if (availableSlotDoc.exists()) {
        setAvailableSlots(availableSlotDoc.data().slots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
    }
  };

  const loadAdditionalInfo = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setAdditionalInfo(userDoc.data().additionalInfo || '');
      }
    } catch (error) {
      console.error('Error loading additional info:', error);
    }
  };

  const saveTimeSlots = async (slots: TimeSlot[]): Promise<void> => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const timeSlotsRef = doc(db, 'timeSlots', `${currentUser.uid}_${dateStr}`);
      
      await setDoc(timeSlotsRef, {
        hostId: currentUser.uid,
        date: dateStr,
        slots: slots,
        updatedAt: new Date()
      });
      
      setTimeSlots(slots);
      await loadMonthTimeSlots(); // 월 데이터 새로고침
      toast.success('일정이 저장되었습니다!');
    } catch (error) {
      console.error('Error saving time slots:', error);
      toast.error('일정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const saveAvailableSlots = async (slots: TimeSlot[]): Promise<void> => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const availableSlotsRef = doc(db, 'availableSlots', `${currentUser.uid}_${dateStr}`);
      
      await setDoc(availableSlotsRef, {
        hostId: currentUser.uid,
        date: dateStr,
        slots: slots,
        updatedAt: new Date()
      });
      
      setAvailableSlots(slots);
      toast.success('가능한 시간대가 저장되었습니다!');
    } catch (error) {
      console.error('Error saving available slots:', error);
      toast.error('가능한 시간대 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const saveAdditionalInfo = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...currentUser,
        additionalInfo: additionalInfo
      }, { merge: true });
      
      toast.success('추가 정보가 저장되었습니다!');
    } catch (error) {
      console.error('Error saving additional info:', error);
      toast.error('추가 정보 저장에 실패했습니다.');
    }
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    setShowSettings(true);
  };

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const handleCloseSettings = (): void => {
    setShowSettings(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 월간 캘린더 데이터 생성
  const generateMonthCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: { date: Date; slots: TimeSlot[] }[] = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const daySlots = allTimeSlots.filter(slot => slot.date === dateStr);
      
      days.push({ date, slots: daySlots });
    }
    
    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handlePrevMonth = (): void => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    setShowSettings(false);
  };

  const handleNextMonth = (): void => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    setShowSettings(false);
  };

  if (!currentUser) {
    return (
      <div className="calendar-container">
        <div className="auth-required">
          <h2>로그인이 필요합니다</h2>
          <p>캘린더를 관리하려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  const monthData = generateMonthCalendar();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>일정 관리</h1>
        <p>월간 캘린더에서 일정을 관리하고 설정하세요</p>
      </div>

      <div className="calendar-main-layout">
        {/* 월간 캘린더 */}
        <div className="calendar-view-section">
          <div className="calendar-header-nav">
            <button onClick={handlePrevMonth} className="month-nav-btn">&lt;</button>
            <h3>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}</h3>
            <button onClick={handleNextMonth} className="month-nav-btn">&gt;</button>
          </div>

          <div className="calendar-grid">
            {/* 요일 헤더 */}
            <div className="calendar-weekdays">
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} className="weekday-header">{day}</div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="calendar-days">
              {monthData.map((dayData, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    !isCurrentMonth(dayData.date) ? 'other-month' : ''
                  } ${isToday(dayData.date) ? 'today' : ''} ${
                    isSelected(dayData.date) ? 'selected' : ''
                  }`}
                  onClick={() => handleDateSelect(dayData.date)}
                >
                  <div className="day-number">{dayData.date.getDate()}</div>
                  
                  {/* 일정 표시 */}
                  <div className="day-slots">
                    {dayData.slots.length > 0 ? (
                      <>
                        {dayData.slots.slice(0, 3).map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="day-slot-indicator"
                            style={{ backgroundColor: slot.color || '#ff6b6b' }}
                            title={`${slot.startTime} - ${slot.endTime}`}
                          />
                        ))}
                        {dayData.slots.length > 3 && (
                          <div className="more-slots">+{dayData.slots.length - 3}</div>
                        )}
                      </>
                    ) : (
                      <div className="no-slots-indicator"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 범례 */}
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color today"></div>
              <span>오늘</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>선택된 날짜</span>
            </div>
            <div className="legend-item">
              <div className="legend-color has-slots"></div>
              <span>일정 있음</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay 설정 패널 */}
      {showSettings && (
        <div className="calendar-overlay" onClick={handleCloseSettings}>
          <div className="calendar-settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>{formatDate(selectedDate)} - 일정 설정</h3>
              <button 
                onClick={handleCloseSettings}
                className="close-settings-btn"
              >
                ✕
              </button>
            </div>

            <div className="settings-content">
              {/* 일정 색상 선택 */}
              <div className="color-picker-section">
                <h4>일정 색상 선택</h4>
                <div className="color-picker-grid">
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      data-color={color}
                      onClick={() => handleColorSelect(color)}
                      title={`색상: ${color}`}
                    />
                  ))}
                </div>
                <p className="color-description">
                  선택한 색상이 새로운 일정에 적용됩니다.
                </p>
              </div>

              {/* 가능한 시간대 설정 */}
              <div className="available-time-section">
                <h4>가능한 시간대 설정</h4>
                <p className="section-description">
                  이 시간대에만 예약을 받을 수 있습니다. 설정하지 않은 시간은 자동으로 잠겨집니다.
                </p>
                {loading ? (
                  <div className="loading">로딩 중...</div>
                ) : (
                  <AvailableTimeManager
                    availableSlots={availableSlots}
                    onSave={saveAvailableSlots}
                    loading={loading}
                    selectedColor={selectedColor}
                  />
                )}
              </div>

              {/* 일정 설정 */}
              <div className="time-slots-section">
                <h4>일정 설정</h4>
                <p className="section-description">
                  해당 날짜의 개인 일정을 관리합니다.
                </p>
                {loading ? (
                  <div className="loading">로딩 중...</div>
                ) : (
                  <TimeSlotManager
                    timeSlots={timeSlots}
                    onSave={saveTimeSlots}
                    loading={loading}
                    selectedColor={selectedColor}
                  />
                )}
              </div>

              {/* 추가 정보 설정 */}
              <div className="additional-info-section">
                <h4>추가 정보 설정</h4>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Zoom 링크, 미팅룸 정보 등을 입력하세요..."
                  className="additional-info-textarea"
                  rows={4}
                />
                <button 
                  onClick={saveAdditionalInfo} 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
