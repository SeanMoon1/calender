import React, { useState } from 'react';
import { TimeSlot } from '../types';
import './TimeSlotManager.css';

interface TimeSlotManagerProps {
  timeSlots: TimeSlot[];
  onSave: (slots: TimeSlot[]) => Promise<void>;
  loading: boolean;
  selectedColor?: string;
}

function TimeSlotManager({ timeSlots, onSave, loading, selectedColor = '#ff6b6b' }: TimeSlotManagerProps): JSX.Element {
  const [slots, setSlots] = useState<TimeSlot[]>(timeSlots);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({ 
    startTime: '09:00', 
    endTime: '10:00',
    color: selectedColor
  });

  const addTimeSlot = (): void => {
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

  const removeTimeSlot = (id: number): void => {
    const updatedSlots = slots.filter(slot => slot.id !== id);
    setSlots(updatedSlots);
  };

  const handleSave = (): void => {
    onSave(slots);
  };

  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="time-slot-manager">
      <div className="add-time-slot">
        <h4>새 시간대 추가</h4>
        <div className="time-inputs">
          <div className="time-input-group">
            <label>시작 시간:</label>
            <select
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <div className="time-input-group">
            <label>종료 시간:</label>
            <select
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <button onClick={addTimeSlot} className="btn btn-secondary">
            추가
          </button>
        </div>
      </div>

      <div className="time-slots-list">
        <h4>설정된 시간대</h4>
        {slots.length === 0 ? (
          <p className="no-slots">설정된 시간대가 없습니다. 위에서 시간대를 추가해주세요.</p>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div 
                key={slot.id} 
                className="time-slot-item"
                style={{ 
                  borderLeft: `4px solid ${slot.color || '#ff6b6b'}`,
                  backgroundColor: `${slot.color || '#ff6b6b'}10`
                }}
              >
                <div className="slot-info">
                  <span className="time-range">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <div 
                    className="color-indicator"
                    style={{ backgroundColor: slot.color || '#ff6b6b' }}
                  />
                </div>
                <button
                  onClick={() => removeTimeSlot(slot.id)}
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
          {loading ? '저장 중...' : '시간대 저장'}
        </button>
      </div>
    </div>
  );
}

export default TimeSlotManager;
