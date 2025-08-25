import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import { Appointment } from '../../types';
import './Dashboard.css';

function Dashboard(): JSX.Element {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (currentUser) {
      setShareUrl(`${window.location.origin}/${currentUser.nickname}`);
      loadAppointments();
    }
  }, [currentUser]);

  const loadAppointments = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('hostId', '==', currentUser.uid),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('일정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (time: string): string => {
    return time;
  };

  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <div className="auth-required">
          <h2>로그인이 필요합니다</h2>
          <p>대시보드를 보려면 로그인해주세요.</p>
          <Link to="/login" className="btn btn-primary">로그인</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>대시보드</h1>
        <p>안녕하세요, {currentUser.nickname}님!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>공유 링크</h3>
          <div className="share-link-container">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-link-input"
            />
            <button onClick={copyToClipboard} className="btn btn-secondary">
              복사
            </button>
          </div>
          <p className="share-description">
            이 링크를 공유하면 다른 사람들이 당신의 일정을 확인하고 예약할 수 있습니다.
          </p>
        </div>

        <div className="dashboard-card">
          <h3>빠른 액션</h3>
          <div className="quick-actions">
            <Link to="/calendar" className="btn btn-primary">
              캘린더 관리
            </Link>
            <button onClick={loadAppointments} className="btn btn-secondary">
              새로고침
            </button>
          </div>
        </div>

        <div className="dashboard-card full-width">
          <h3>예약된 일정</h3>
          {loading ? (
            <div className="loading">일정을 불러오는 중...</div>
          ) : appointments.length === 0 ? (
            <div className="no-appointments">
              <p>아직 예약된 일정이 없습니다.</p>
              <p>캘린더에서 가능한 시간을 설정하고 링크를 공유해보세요!</p>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <h4>{appointment.clientName}</h4>
                    <p className="appointment-date">
                      📅 {formatDate(appointment.date)}
                    </p>
                    <p className="appointment-time">
                      ⏰ {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </p>
                    <p className="appointment-email">
                      📧 {appointment.clientEmail}
                    </p>
                    {appointment.additionalInfo && (
                      <p className="appointment-notes">
                        💬 {appointment.additionalInfo}
                      </p>
                    )}
                  </div>
                  <div className="appointment-status">
                    <span className={`status ${appointment.status || 'confirmed'}`}>
                      {appointment.status === 'confirmed' ? '확정' : '대기중'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
