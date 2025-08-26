import { FirebaseError } from '../types';

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const firebaseError = error as FirebaseError;
    
    switch (firebaseError.code) {
      case 'auth/user-not-found':
        return '사용자를 찾을 수 없습니다.';
      case 'auth/wrong-password':
        return '비밀번호가 올바르지 않습니다.';
      case 'auth/email-already-in-use':
        return '이미 사용 중인 이메일입니다.';
      case 'auth/weak-password':
        return '비밀번호가 너무 약합니다. (최소 6자)';
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.';
      case 'auth/popup-closed-by-user':
        return '로그인 창이 닫혔습니다. 다시 시도해주세요.';
      case 'auth/cancelled-popup-request':
        return '로그인이 취소되었습니다.';
      case 'auth/network-request-failed':
        return '네트워크 연결을 확인해주세요.';
      default:
        return firebaseError.message || '알 수 없는 오류가 발생했습니다.';
    }
  }

  return '알 수 없는 오류가 발생했습니다.';
};

export const logError = (error: unknown, context?: string): void => {
  const timestamp = new Date().toISOString();
  const errorMessage = getErrorMessage(error);
  
  console.error(`[${timestamp}] ${context ? `[${context}] ` : ''}${errorMessage}`, error);
};
