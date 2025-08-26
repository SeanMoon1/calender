export interface User {
  uid: string;
  email: string;
  nickname: string;
  isHost: boolean;
  additionalInfo?: string;
  createdAt: Date;
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  color?: string;
}

export interface Appointment {
  id: string;
  hostId: string;
  hostNickname: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientEmail: string;
  additionalInfo?: string;
  status: 'confirmed' | 'pending';
  createdAt: Date;
}

export interface AppointmentFormData {
  name: string;
  email: string;
  additionalInfo: string;
}

export interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string, nickname: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  getUserData: (uid: string) => Promise<User | null>;
}

// 추가 타입 정의
export interface FirebaseError {
  code: string;
  message: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
