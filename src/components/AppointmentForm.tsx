import React, { useState } from 'react';
import { TimeSlot, AppointmentFormData } from '../types';
import './AppointmentForm.css';

interface AppointmentFormProps {
  selectedSlot: TimeSlot;
  selectedDate: Date;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCancel: () => void;
}

function AppointmentForm({ selectedSlot, selectedDate, onSubmit, onCancel }: AppointmentFormProps): JSX.Element {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    email: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Appointment submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="appointment-form">
      <div className="form-header">
        <h3>일정 예약</h3>
        <button onClick={onCancel} className="close-btn">
          ✕
        </button>
      </div>

      <div className="appointment-details">
        <p><strong>날짜:</strong> {formatDate(selectedDate)}</p>
        <p><strong>시간:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">이름 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일 *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalInfo">추가 정보</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="미팅 목적, 특별한 요청사항 등을 입력하세요"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '예약 중...' : '예약하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
