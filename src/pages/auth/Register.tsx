import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

function Register(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !nickname) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (nickname.length < 2) {
      toast.error('닉네임은 최소 2자 이상이어야 합니다.');
      return;
    }

    // 닉네임에 특수문자나 공백이 있는지 확인
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(nickname)) {
      toast.error('닉네임은 영문, 숫자, 한글만 사용 가능합니다.');
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, nickname);
      toast.success('회원가입이 완료되었습니다!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('이미 사용 중인 이메일입니다.');
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (): Promise<void> => {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      toast.success('Google로 회원가입되었습니다!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('회원가입 창이 닫혔습니다. 다시 시도해주세요.');
      } else {
        toast.error('Google 회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입</h2>
        
        {/* Google OAuth Button */}
        <button 
          onClick={handleGoogleSignup} 
          className="btn btn-google" 
          disabled={googleLoading}
        >
          {googleLoading ? '회원가입 중...' : 'Google로 회원가입'}
        </button>
        
        <div className="divider">
          <span>또는</span>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일을 입력하세요"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="닉네임을 입력하세요 (영문, 숫자, 한글)"
            />
            <small>닉네임은 URL에 사용됩니다. (예: /your-nickname)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요 (최소 6자)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
