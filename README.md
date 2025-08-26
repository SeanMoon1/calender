# Freelancer Calendar - 일정 관리 웹 서비스

프리랜서를 위한 일정 관리 웹 서비스입니다. 호스트가 자신의 가능한 시간을 설정하고, 클라이언트가 예약을 신청할 수 있는 플랫폼입니다.

## 🚀 주요 기능

- **호스트 기능**
  - 회원가입 및 로그인 (이메일/비밀번호, Google OAuth)
  - 캘린더를 통한 시간대 설정 (분 단위)
  - 시간대별 색상 커스터마이징
  - 예약 관리 및 확인
  - 추가 정보 설정 (Zoom 링크 등)

- **클라이언트 기능**
  - 호스트의 공개 스케줄 확인
  - 예약 신청 (이름, 이메일 필수)
  - 예약 상태 확인

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Styling**: CSS3, 반응형 디자인
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **UI Components**: React Calendar, React Time Picker
- **Notifications**: React Hot Toast

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Navbar.tsx
│   ├── TimeSlotManager.tsx
│   └── AppointmentForm.tsx
├── contexts/           # React Context
│   └── AuthContext.tsx
├── pages/             # 페이지 컴포넌트
│   ├── auth/          # 인증 관련 페이지
│   ├── calendar/      # 캘린더 관리
│   ├── dashboard/     # 대시보드
│   └── schedule/      # 스케줄 뷰
├── firebase/          # Firebase 설정
│   └── config.ts
├── types/             # TypeScript 타입 정의
│   └── index.ts
├── utils/             # 유틸리티 함수
│   ├── validation.ts
│   └── errorHandler.ts
├── constants/         # 상수 정의
│   └── index.ts
└── App.tsx           # 메인 앱 컴포넌트
```

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd calender
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env` 파일을 프로젝트 루트에 생성하고 Firebase 설정을 추가:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행
```bash
npm start
```

### 5. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# Firebase 배포
npm run deploy
```

## 📋 사용 가능한 스크립트

- `npm start` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run deploy` - 전체 Firebase 배포
- `npm run deploy:hosting` - Hosting만 배포
- `npm run deploy:firestore` - Firestore 규칙만 배포
- `npm run type-check` - TypeScript 타입 체크
- `npm run clean` - 빌드 캐시 정리

## 🔧 개발 가이드라인

### 코드 스타일
- TypeScript strict 모드 사용
- 함수형 컴포넌트와 React Hooks 사용
- 일관된 네이밍 컨벤션 (camelCase)
- 적절한 타입 정의 및 인터페이스 사용

### 폴더 구조
- 기능별로 폴더 분리
- 컴포넌트와 스타일 파일 함께 배치
- 유틸리티 함수는 별도 폴더에 분리

### 에러 처리
- 중앙화된 에러 핸들링
- 사용자 친화적인 에러 메시지
- 적절한 로딩 상태 관리

## 🔒 보안

- Firebase 보안 규칙 적용
- 사용자 인증 및 권한 관리
- 입력값 검증 및 sanitization

## 📱 반응형 디자인

- 모바일 우선 접근법
- CSS Grid 및 Flexbox 활용
- 다양한 화면 크기 지원

## 🚀 배포

Firebase Hosting을 통해 배포됩니다:
- URL: https://calender-control-2025.web.app
- 자동 HTTPS 적용
- CDN을 통한 빠른 로딩

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
