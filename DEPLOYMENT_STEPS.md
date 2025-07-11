# 🚀 EduAssess Render 배포 단계별 가이드

## 1️⃣ GitHub 리포지토리 생성 및 업로드

### GitHub 계정으로 새 리포지토리 생성
1. [GitHub](https://github.com)에 로그인
2. "New repository" 클릭
3. Repository name: `eduassess-platform`
4. Description: `한국어 온라인 교육 평가 플랫폼 - 애니메이션 온보딩 튜토리얼 시스템`
5. Public 또는 Private 선택
6. "Create repository" 클릭

### 로컬 프로젝트를 GitHub에 업로드
```bash
# 현재 프로젝트 디렉토리에서 실행
git init
git add .
git commit -m "Initial commit: EduAssess Platform with Animated Onboarding Tutorials"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eduassess-platform.git
git push -u origin main
```

## 2️⃣ Render 계정 생성

1. [Render.com](https://render.com) 방문
2. "Get Started" 클릭
3. GitHub 계정으로 연결하여 회원가입
4. 무료 플랜으로 시작

## 3️⃣ PostgreSQL 데이터베이스 생성

### Render에서 데이터베이스 서비스 생성
1. Render 대시보드에서 "New +" 클릭
2. "PostgreSQL" 선택
3. 설정값 입력:
   - **Name**: `eduassess-db`
   - **Database**: `eduassess`
   - **User**: `eduassess_user`
   - **Plan**: Free (무료)
4. "Create Database" 클릭
5. **External Database URL** 복사 (나중에 사용)

## 4️⃣ 웹 서비스 생성

### GitHub 리포지토리 연결
1. Render 대시보드에서 "New +" 클릭
2. "Web Service" 선택
3. "Connect a repository" → GitHub 계정 연결
4. `eduassess-platform` 리포지토리 선택

### 서비스 설정
- **Name**: `eduassess-platform`
- **Root Directory**: (비워둠 - 루트 디렉토리 사용)
- **Environment**: Node
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Plan**: Free (무료)

## 5️⃣ 환경 변수 설정

### Environment Variables 추가
"Advanced" 섹션에서 Environment Variables 추가:

```
NODE_ENV = production
DATABASE_URL = [3단계에서 복사한 PostgreSQL External Database URL]
```

**중요**: DATABASE_URL은 따옴표 없이 전체 URL을 붙여넣기

## 6️⃣ 배포 설정 완료

### 자동 배포 설정
- **Auto-Deploy**: Yes (GitHub push 시 자동 재배포)
- **Branch**: main

### 배포 시작
1. "Create Web Service" 클릭
2. 배포 진행 상황을 로그에서 확인
3. 첫 배포는 5-10분 소요

## 7️⃣ 배포 확인 및 테스트

### 배포 완료 확인
1. 배포 로그에서 "Build successful" 확인
2. "Your service is live" 메시지 확인
3. 제공된 URL 클릭 (예: `https://eduassess-platform.onrender.com`)

### 기능 테스트
**교사 로그인 테스트:**
- ID: `admin`
- 패스워드: `jhj0901`

**학생 로그인 테스트:**
- 성명: `홍길동`
- 생년월일: `950101`

**핵심 기능 확인:**
- [ ] 교사 대시보드 접속
- [ ] 학생 대시보드 접속  
- [ ] 온보딩 튜토리얼 시스템 작동
- [ ] 게임화 시스템 (포인트, 배지, 성취)
- [ ] 접근성 기능 (고대비 모드, 글자 크기)

## 8️⃣ 도메인 설정 (선택사항)

### 무료 도메인 옵션
1. **Freenom**: `.tk`, `.ml`, `.ga`, `.cf` 무료 도메인
2. **GitHub Student Pack**: 학생 인증 시 `.me` 도메인 1년 무료

### 커스텀 도메인 연결
1. 도메인 등록 후 Render 대시보드에서 "Custom Domains" 설정
2. DNS 설정에서 CNAME 레코드 추가
3. SSL 인증서 자동 발급 확인

## 9️⃣ 성능 최적화 팁

### 슬립 모드 대응
- 무료 플랜에서는 15분 비활성 후 슬립 모드
- 첫 접속 시 30초 정도 대기 시간 발생
- 활성화 후에는 정상 속도로 작동

### 모니터링
- Render 대시보드에서 실시간 로그 확인
- 메트릭스에서 CPU/메모리 사용량 모니터링
- 배포 기록 및 오류 로그 추적

## 🎯 배포 성공 체크리스트

- [ ] GitHub 리포지토리 생성 및 코드 업로드
- [ ] Render 계정 생성 완료
- [ ] PostgreSQL 데이터베이스 생성 및 URL 확보
- [ ] 웹 서비스 생성 및 GitHub 연결
- [ ] 빌드/시작 명령어 설정
- [ ] 환경 변수 (NODE_ENV, DATABASE_URL) 설정
- [ ] 첫 배포 성공 및 서비스 라이브 확인
- [ ] 교사/학생 로그인 테스트 통과
- [ ] 온보딩 튜토리얼 시스템 작동 확인
- [ ] 모든 핵심 기능 정상 작동
- [ ] 도메인 설정 (선택사항)

## 🔧 문제 해결

### 일반적인 오류 및 해결책

**1. 빌드 실패 시:**
- 로그에서 구체적인 오류 메시지 확인
- `npm install` 과정에서 의존성 설치 실패 여부 확인
- Node.js 버전 호환성 문제 확인

**2. 데이터베이스 연결 실패:**
- DATABASE_URL 환경 변수 정확성 확인
- PostgreSQL 서비스 상태 확인
- 네트워크 연결 오류 확인

**3. 서비스 시작 실패:**
- Start Command 정확성 확인
- 포트 바인딩 설정 확인 (5000번 포트)
- 환경 변수 설정 확인

### 고급 디버깅
```bash
# 로컬에서 프로덕션 모드 테스트
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## 📞 추가 지원

배포 중 문제가 발생하면:
1. Render 공식 문서: [render.com/docs](https://render.com/docs)
2. GitHub Issues: 프로젝트 리포지토리에 이슈 생성
3. Render 커뮤니티: [community.render.com](https://community.render.com)

---

**축하합니다! 🎉**
EduAssess 플랫폼이 성공적으로 배포되었습니다. 이제 전 세계 어디서나 온라인 교육 평가 시스템을 사용할 수 있습니다!