import React, { useState } from 'react';
import { TimeSlot } from '../types';
import './AvailableTimeManager.css';

interface AvailableTimeManagerProps {
  availableSlots: TimeSlot[];
  onSave: (slots: TimeSlot[]) => Promise<void>;
  loading: boolean;
  selectedColor?: string;
}

function AvailableTimeManager({ availableSlots, onSave, loading, selectedColor = '#4CAF50' }: AvailableTimeManagerProps): JSX.Element {
  const [slots, setSlots] = useState<TimeSlot[]>(availableSlots);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({ 
    startTime: '09:00', 
    endTime: '10:00',
    color: selectedColor
  });

  const addAvailableTime = (): void => {
    // 시간 형식 검증
    if (!validateTimeFormat(newSlot.startTime) || !validateTimeFormat(newSlot.endTime)) {
      alert('올바른 시간 형식을 입력해주세요. (예: 09:30, 14:15)');
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      alert('시작 시간은 종료 시간보다 빨라야 합니다.');
      return;
    }

    // 중복 시간대 확인
    const isOverlapping = slots.some(slot => 
      (newSlot.startTime < slot.endTime && newSlot.endTime > slot.startTime)
    );

    if (isOverlapping) {
      alert('시간대가 겹칩니다. 다른 시간을 선택해주세요.');
      return;
    }

    const updatedSlots = [...slots, { ...newSlot, id: Date.now() }];
    setSlots(updatedSlots);
    setNewSlot({ startTime: '09:00', endTime: '10:00', color: selectedColor });
  };

  const removeAvailableTime = (id: number): void => {
    const updatedSlots = slots.filter(slot => slot.id !== id);
    setSlots(updatedSlots);
  };

  const handleSave = (): void => {
    onSave(slots);
  };

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const formatTimeInput = (value: string): string => {
    // 숫자만 입력받아서 시간 형식으로 변환
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    }
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  };

  return (
    <div className="available-time-manager">
      <div className="add-available-time">
        <h4>가능한 시간대 추가</h4>
        <p className="description">
          이 시간대에만 예약을 받을 수 있습니다. 설정하지 않은 시간은 자동으로 잠겨집니다.
        </p>
        <div className="time-inputs">
          <div className="time-input-group">
            <label>시작 시간:</label>
            <input
              type="text"
              value={newSlot.startTime}
              onChange={(e) => {
                const formatted = formatTimeInput(e.target.value);
                setNewSlot({ ...newSlot, startTime: formatted });
              }}
              placeholder="09:00"
              maxLength={5}
              className="time-input"
            />
            <small>형식: HH:MM (예: 09:30, 14:15)</small>
          </div>
          
          <div className="time-input-group">
            <label>종료 시간:</label>
            <input
              type="text"
              value={newSlot.endTime}
              onChange={(e) => {
                const formatted = formatTimeInput(e.target.value);
                setNewSlot({ ...newSlot, endTime: formatted });
              }}
              placeholder="10:00"
              maxLength={5}
              className="time-input"
            />
            <small>형식: HH:MM (예: 10:30, 15:45)</small>
          </div>
          
          <button onClick={addAvailableTime} className="btn btn-secondary">
            추가
          </button>
        </div>
      </div>

      <div className="available-times-list">
        <h4>설정된 가능 시간대</h4>
        {slots.length === 0 ? (
          <p className="no-slots">
            설정된 가능 시간대가 없습니다. 
            <br />
            모든 시간이 잠겨있어 예약을 받을 수 없습니다.
          </p>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div 
                key={slot.id} 
                className="available-time-item"
                style={{ 
                  borderLeft: `4px solid ${slot.color || '#4CAF50'}`,
                  backgroundColor: `${slot.color || '#4CAF50'}10`
                }}
              >
                <div className="slot-info">
                  <span className="time-range">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <div 
                    className="color-indicator"
                    style={{ backgroundColor: slot.color || '#4CAF50' }}
                  />
                </div>
                <button
                  onClick={() => removeAvailableTime(slot.id)}
                  className="remove-btn"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="save-section">
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '저장 중...' : '가능 시간대 저장'}
        </button>
      </div>
    </div>
  );
}

export default AvailableTimeManager;
