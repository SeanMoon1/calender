# Freelancer Calendar

프리랜서를 위한 일정 관리 웹 서비스입니다. React Hook과 TypeScript를 활용한 MPA(Multi-Page Application)로 개발되었으며, Firebase를 사용하여 배포할 수 있습니다.

## 주요 기능

### 🔐 사용자 인증
- 회원가입 및 로그인 기능
- Google OAuth 로그인 지원
- 닉네임 기반 고유 URL 생성 (`/닉네임`)

### 📅 일정 관리
- 날짜별 가능한 시간 설정
- 분 단위까지 정확한 시간 설정
- 기본적으로 모든 시간이 잠겨있어 안전한 관리

### 🔗 일정 공유
- 개인 링크를 통한 일정 공유
- 비로그인 사용자도 일정 확인 및 예약 가능

### 📧 예약 시스템
- 이름과 이메일을 통한 일정 예약
- 추가 정보 입력 가능 (미팅 목적, 요청사항 등)
- 자동 이메일 알림 기능 (구현 예정)

### 💬 추가 정보 설정
- Zoom 링크, 미팅룸 정보 등 추가 정보 설정
- 예약자에게 자동으로 전달

## 기술 스택

- **Frontend**: React 18, TypeScript, React Router DOM
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: CSS3, Responsive Design
- **Deployment**: Firebase Hosting

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. Firebase 설정
1. Firebase 프로젝트 생성
2. Authentication에서 Google 로그인 활성화
3. `src/firebase/config.ts` 파일에서 Firebase 설정 정보 입력
4. Firestore 데이터베이스 생성 및 보안 규칙 설정

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 빌드 및 배포
```bash
npm run build
npm run deploy
```

## 프로젝트 구조

```
src/
├── components/              # 재사용 가능한 컴포넌트
│   ├── Navbar.tsx          # 네비게이션 바
│   ├── TimeSlotManager.tsx # 시간대 관리
│   └── AppointmentForm.tsx # 예약 폼
├── contexts/               # React Context
│   └── AuthContext.tsx     # 인증 상태 관리
├── pages/                  # 페이지 컴포넌트
│   ├── Home.tsx           # 홈 페이지
│   ├── auth/              # 인증 관련 페이지
│   │   ├── Login.tsx      # 로그인 페이지
│   │   ├── Register.tsx   # 회원가입 페이지
│   │   └── Auth.css       # 인증 페이지 스타일
│   ├── dashboard/         # 대시보드 관련 페이지
│   │   ├── Dashboard.tsx  # 대시보드
│   │   └── Dashboard.css  # 대시보드 스타일
│   ├── calendar/          # 캘린더 관련 페이지
│   │   ├── Calendar.tsx   # 캘린더 관리
│   │   └── Calendar.css   # 캘린더 스타일
│   └── schedule/          # 예약 관련 페이지
│       ├── ScheduleView.tsx # 일정 확인 페이지
│       └── ScheduleView.css # 일정 확인 스타일
├── firebase/              # Firebase 설정
│   └── config.ts          # Firebase 설정
├── types/                 # TypeScript 타입 정의
│   └── index.ts           # 공통 타입 정의
├── App.tsx                # 메인 앱 컴포넌트
└── index.tsx              # 앱 진입점
```

## 사용 방법

### 호스트 (프리랜서)
1. 회원가입 후 로그인
2. 캘린더에서 가능한 시간 설정
3. 대시보드에서 공유 링크 확인
4. 링크를 클라이언트에게 공유

### 클라이언트 (예약자)
1. 호스트가 공유한 링크 접속
2. 원하는 날짜 선택
3. 가능한 시간대 확인
4. 시간대 클릭하여 예약 폼 작성
5. 이름, 이메일, 추가 정보 입력 후 예약

## Firebase 설정

### Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 문서
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 시간대 문서
    match /timeSlots/{timeSlotId} {
      allow read: if true;  // 모든 사용자가 읽기 가능
      allow write: if request.auth != null && 
        timeSlotId.matches(request.auth.uid + '_.*');
    }
    
    // 예약 문서
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## TypeScript 특징

- **타입 안전성**: 모든 컴포넌트와 함수에 타입 정의
- **인터페이스**: 공통 타입을 `src/types/index.ts`에서 관리
- **엄격한 타입 검사**: 컴파일 타임에 오류 감지
- **자동완성**: IDE에서 향상된 개발 경험

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
