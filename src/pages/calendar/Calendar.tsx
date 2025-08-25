import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import TimeSlotManager from '../../components/TimeSlotManager';
import { TimeSlot } from '../../types';
import './Calendar.css';

function Calendar(): JSX.Element {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');

  // Predefined colors for time slots
  const colorOptions = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
    '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
  ];

  useEffect(() => {
    if (currentUser) {
      loadTimeSlots();
      loadAdditionalInfo();
    }
  }, [currentUser, selectedDate]);

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
      toast.success('시간대가 저장되었습니다!');
    } catch (error) {
      console.error('Error saving time slots:', error);
      toast.error('시간대 저장에 실패했습니다.');
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

  const handleDateChange = (date: Date): void => {
    setSelectedDate(date);
  };

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
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

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>캘린더 관리</h1>
        <p>가능한 시간을 설정하고 일정을 관리하세요</p>
      </div>

      <div className="calendar-content">
        <div className="calendar-sidebar">
          <div className="date-selector">
            <h3>날짜 선택</h3>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              min={new Date().toISOString().split('T')[0]}
              className="date-input"
            />
            <p className="selected-date">
              선택된 날짜: {formatDate(selectedDate)}
            </p>
          </div>

          <div className="color-picker-section">
            <h3>시간대 색상 선택</h3>
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
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              선택한 색상이 새로운 시간대에 적용됩니다.
            </p>
          </div>

          <div className="additional-info-section">
            <h3>추가 정보 설정</h3>
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

        <div className="calendar-main">
          <div className="time-slots-header">
            <h3>{formatDate(selectedDate)} - 가능한 시간 설정</h3>
            <p>선택한 날짜에 가능한 시간대를 설정하세요. 설정하지 않은 시간은 자동으로 잠겨집니다.</p>
          </div>

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
      </div>
    </div>
  );
}

export default Calendar;
