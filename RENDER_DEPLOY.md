# Render 배포 가이드

## 🚀 EduAssess 플랫폼 Render 배포하기

### 1. GitHub 리포지토리 준비

1. **GitHub에 새 리포지토리 생성**
   - 리포지토리 이름: `eduassess-platform`
   - Public 또는 Private 선택

2. **로컬 프로젝트를 GitHub에 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - EduAssess Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/eduassess-platform.git
   git push -u origin main
   ```

### 2. Render 계정 생성 및 서비스 설정

1. **Render 계정 생성**
   - [render.com](https://render.com) 방문
   - GitHub 계정으로 연동 가능

2. **PostgreSQL 데이터베이스 생성**
   - Dashboard → "New" → "PostgreSQL"
   - 이름: `eduassess-db`
   - 무료 플랜 선택
   - 데이터베이스 URL 복사해두기

3. **웹 서비스 생성**
   - Dashboard → "New" → "Web Service"
   - GitHub 리포지토리 연결
   - 서비스 이름: `eduassess-platform`

### 3. 빌드 설정

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Root Directory:**
```
. (루트 디렉토리)
```

### 4. 환경 변수 설정

Render 대시보드에서 다음 환경 변수 추가:

```
NODE_ENV=production
DATABASE_URL=[PostgreSQL 데이터베이스 URL]
```

### 5. 자동 배포 설정

- Auto-Deploy: Yes (GitHub push 시 자동 배포)
- Branch: main

### 6. 도메인 설정

**무료 도메인:**
- 기본: `https://eduassess-platform.onrender.com`
- 커스텀 서브도메인 설정 가능

**커스텀 도메인 (선택사항):**
- Freenom에서 무료 도메인 등록 (.tk, .ml, .ga)
- Render에서 커스텀 도메인 연결

### 7. 배포 후 확인사항

1. **데이터베이스 연결 확인**
   - 로그에서 DB 연결 성공 메시지 확인

2. **기능 테스트**
   - 교사 로그인: admin / jhj0901
   - 학생 로그인: 홍길동 / 950101
   - 온보딩 튜토리얼 시스템 작동 확인

3. **성능 확인**
   - 첫 접속 시 슬립 모드에서 깨어나는 시간 (15-30초)

### 8. 주의사항

- **슬립 모드**: 15분 비활성 후 서비스 슬립
- **깨우기**: 첫 접속 시 약간의 지연 시간
- **데이터 지속성**: PostgreSQL 데이터는 유지됨
- **업로드 파일**: 무료 플랜에서는 재시작 시 삭제됨

### 9. 배포 완료 후

**접속 URL:**
- https://eduassess-platform.onrender.com

**테스트 계정:**
- 교사: admin / jhj0901
- 학생: 홍길동 / 950101

### 10. 유지보수

- **로그 확인**: Render 대시보드에서 실시간 로그 모니터링
- **업데이트**: GitHub push 시 자동 재배포
- **데이터베이스**: Render 대시보드에서 관리

---

## 🎯 배포 상태 체크리스트

- [ ] GitHub 리포지토리 생성 및 코드 업로드
- [ ] Render 계정 생성
- [ ] PostgreSQL 데이터베이스 생성
- [ ] 웹 서비스 생성 및 설정
- [ ] 환경 변수 설정
- [ ] 첫 배포 성공
- [ ] 데이터베이스 연결 확인
- [ ] 로그인 기능 테스트
- [ ] 온보딩 튜토리얼 테스트
- [ ] 도메인 설정 (선택사항)

준비가 완료되면 위 단계를 따라 배포를 진행하세요!