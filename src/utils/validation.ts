import { FormValidation } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// 닉네임 검증: 소문자 영어와 숫자만 허용
export const validateNickname = (nickname: string): boolean => {
  const nicknameRegex = /^[a-z0-9]+$/;
  return nickname.length >= 2 && nickname.length <= 20 && nicknameRegex.test(nickname);
};

// 닉네임 정규화: 대문자를 소문자로 변환하고 특수문자 제거
export const sanitizeNickname = (nickname: string): string => {
  return nickname.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const validateTimeSlot = (startTime: string, endTime: string): boolean => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return start < end;
};

export const validateAppointmentForm = (data: {
  name: string;
  email: string;
  additionalInfo: string;
}): FormValidation => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  }

  if (!validateEmail(data.email)) {
    errors.email = '유효한 이메일을 입력해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
