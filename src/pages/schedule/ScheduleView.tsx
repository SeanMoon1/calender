import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import AppointmentForm from '../../components/AppointmentForm';
import { User, TimeSlot, Appointment, AppointmentFormData } from '../../types';
import './ScheduleView.css';

interface Host extends User {
  id: string;
}

function ScheduleView(): JSX.Element {
  const { nickname } = useParams<{ nickname: string }>();
  const [host, setHost] = useState<Host | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Appointment[]>([]);

  useEffect(() => {
    if (nickname) {
      loadHostData();
    }
  }, [nickname]);

  useEffect(() => {
    if (host) {
      loadTimeSlots();
      loadBookedSlots();
    }
  }, [host, selectedDate]);

  const loadHostData = async (): Promise<void> => {
    if (!nickname) return;
    
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('nickname', '==', nickname));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('사용자를 찾을 수 없습니다.');
        return;
      }
      
      const hostData = querySnapshot.docs[0].data() as User;
      setHost({ id: querySnapshot.docs[0].id, ...hostData });
    } catch (error) {
      console.error('Error loading host data:', error);
      toast.error('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async (): Promise<void> => {
    if (!host) return;
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const timeSlotsRef = doc(db, 'timeSlots', `${host.id}_${dateStr}`);
      const timeSlotDoc = await getDoc(timeSlotsRef);
      
      if (timeSlotDoc.exists()) {
        setTimeSlots(timeSlotDoc.data().slots || []);
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const loadBookedSlots = async (): Promise<void> => {
    if (!host) return;
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('hostId', '==', host.id),
        where('date', '==', dateStr)
      );
      
      const querySnapshot = await getDocs(q);
      const booked = querySnapshot.docs.map(doc => doc.data()) as Appointment[];
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error loading booked slots:', error);
    }
  };

  const handleDateChange = (date: Date): void => {
    setSelectedDate(date);
    setShowAppointmentForm(false);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot: TimeSlot): void => {
    // 이미 예약된 시간대인지 확인
    const isBooked = bookedSlots.some(booking => 
      booking.startTime === slot.startTime && booking.endTime === slot.endTime
    );
    
    if (isBooked) {
      toast.error('이미 예약된 시간입니다.');
      return;
    }
    
    setSelectedSlot(slot);
    setShowAppointmentForm(true);
  };

  const handleAppointmentSubmit = async (appointmentData: AppointmentFormData): Promise<void> => {
    if (!host || !selectedSlot) return;
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const appointment: Omit<Appointment, 'id'> = {
        hostId: host.id,
        hostNickname: host.nickname,
        date: dateStr,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        clientName: appointmentData.name,
        clientEmail: appointmentData.email,
        additionalInfo: appointmentData.additionalInfo,
        status: 'confirmed',
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'appointments'), appointment);
      
      toast.success('일정이 성공적으로 예약되었습니다!');
      setShowAppointmentForm(false);
      setSelectedSlot(null);
      loadBookedSlots(); // 예약된 시간대 다시 로드
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('일정 예약에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const isSlotBooked = (slot: TimeSlot): boolean => {
    return bookedSlots.some(booking => 
      booking.startTime === slot.startTime && booking.endTime === slot.endTime
    );
  };

  if (loading) {
    return (
      <div className="schedule-view-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!host) {
    return (
      <div className="schedule-view-container">
        <div className="error-message">
          <h2>사용자를 찾을 수 없습니다</h2>
          <p>링크를 다시 확인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-view-container">
      <div className="schedule-header">
        <h1>{host.nickname}님의 일정</h1>
        {host.additionalInfo && (
          <div className="additional-info">
            <h3>추가 정보</h3>
            <p>{host.additionalInfo}</p>
          </div>
        )}
      </div>

      <div className="schedule-content">
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

        <div className="time-slots-section">
          <h3>가능한 시간</h3>
          {timeSlots.length === 0 ? (
            <div className="no-slots">
              <p>이 날짜에는 가능한 시간이 설정되지 않았습니다.</p>
              <p>다른 날짜를 선택해주세요.</p>
            </div>
          ) : (
            <div className="time-slots-grid">
              {timeSlots.map((slot, index) => {
                const isBooked = isSlotBooked(slot);
                return (
                  <div
                    key={index}
                    className={`time-slot ${isBooked ? 'booked' : 'available'}`}
                    onClick={() => !isBooked && handleSlotClick(slot)}
                    style={{
                      backgroundColor: isBooked ? undefined : `${slot.color || '#ff6b6b'}15`,
                      borderColor: isBooked ? undefined : slot.color || '#ff6b6b'
                    }}
                  >
                    <span className="time-range">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {!isBooked && slot.color && (
                      <div 
                        className="color-indicator"
                        style={{ backgroundColor: slot.color }}
                      />
                    )}
                    {isBooked && <span className="booked-label">예약됨</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showAppointmentForm && selectedSlot && (
          <div className="appointment-form-overlay">
            <div className="appointment-form-container">
              <AppointmentForm
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                onSubmit={handleAppointmentSubmit}
                onCancel={() => {
                  setShowAppointmentForm(false);
                  setSelectedSlot(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleView;
