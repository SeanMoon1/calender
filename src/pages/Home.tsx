import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

function Home(): JSX.Element {
  const { currentUser } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Freelancer Calendar</h1>
        <p>효율적인 일정 관리로 프리랜서의 시간을 관리하세요</p>
        
        {currentUser ? (
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              대시보드로 이동
            </Link>
            <Link to="/calendar" className="btn btn-secondary">
              캘린더 보기
            </Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              회원가입
            </Link>
            <Link to="/login" className="btn btn-secondary">
              로그인
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>주요 기능</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📅 스마트 일정 관리</h3>
            <p>날짜별로 가능한 시간을 설정하고 관리할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>🔗 개인 링크 공유</h3>
            <p>닉네임 기반의 고유 URL로 일정을 공유할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>⏰ 분 단위 시간 설정</h3>
            <p>정확한 시간을 분 단위까지 설정할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>📧 자동 이메일 알림</h3>
            <p>약속 시간이 다가오면 자동으로 이메일이 발송됩니다.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 안전한 일정 관리</h3>
            <p>기본적으로 모든 시간이 잠겨있어 안전하게 관리됩니다.</p>
          </div>
          <div className="feature-card">
            <h3>💬 추가 정보 설정</h3>
            <p>Zoom 링크 등 추가 정보를 설정할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
