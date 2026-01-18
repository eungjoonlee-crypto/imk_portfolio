# 빠른 수정 가이드 (400 오류 해결)

## 문제
`.env` 파일에 **잘못된 프로젝트 ID**가 설정되어 있습니다.

## 빠른 해결 (3단계)

### 1단계: .env 파일 열기
프로젝트 루트 디렉토리의 `.env` 파일을 엽니다.

### 2단계: 다음 내용으로 교체

```bash
VITE_SUPABASE_URL=https://gotdcbpobucrspqwyqgb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdGRjYnBvYnVjcnNwcXd5cWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMzM3MjgsImV4cCI6MjA4MzYwOTcyOH0.여기에_올바른_키
```

**⚠️ 중요**: `VITE_SUPABASE_PUBLISHABLE_KEY`는 Supabase Dashboard에서 확인한 **올바른 프로젝트(`gotdcbpobucrspqwyqgb`)의 anon 키**로 교체해야 합니다.

### 3단계: 서버 재시작
```bash
npm run dev
```

## Publishable Key 확인 방법

1. https://supabase.com/dashboard 접속
2. 프로젝트 `gotdcbpobucrspqwyqgb` 선택
3. 왼쪽 메뉴: **Settings** → **API**
4. "Project API keys" 섹션에서 `anon` `public` 키 복사
5. `.env` 파일에 붙여넣기

## 확인 사항
- ✅ URL과 프로젝트 ID가 일치해야 함
- ✅ Publishable Key도 올바른 프로젝트의 키여야 함
- ✅ `.env` 파일 저장 후 서버 재시작 필수
