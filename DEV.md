# 로컬 개발 서버 실행 방법

## 사전 준비

`.env.local` 파일이 프로젝트 루트에 있어야 합니다.

```
KWATER_SERVICE_KEY=<K-water 공공데이터 API 인증키>
```

## 실행

```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 빌드 및 프로덕션 실행

```bash
npm run build
npm run start
```
