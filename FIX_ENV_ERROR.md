# .env 파일 수정 가이드 (400 오류 해결)

## 문제 원인
`.env` 파일에 **잘못된 프로젝트 ID**가 설정되어 있습니다.

## 현재 상황
- ❌ 잘못된 프로젝트 ID: `gcpdcotbvsvyuthqhxoi`
- ✅ 올바른 프로젝트 ID: `gotdcbpobucrspqwyqgb`

## 해결 방법

### 1. .env 파일 열기
프로젝트 루트 디렉토리의 `.env` 파일을 텍스트 에디터로 엽니다.

### 2. 다음 내용으로 수정

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://gotdcbpobucrspqwyqgb.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=여기에_올바른_publishable_key_입력

# 또는 기존 키가 맞다면 URL만 변경
# VITE_SUPABASE_URL=https://gotdcbpobucrspqwyqgb.supabase.co
```

### 3. Publishable Key 확인 방법
Supabase Dashboard에서 확인:
1. https://supabase.com/dashboard 접속
2. 프로젝트 `gotdcbpobucrspqwyqgb` 선택
3. Settings → API 메뉴
4. "Project API keys" 섹션에서 `anon` 또는 `public` 키 복사

### 4. 서버 재시작
`.env` 파일을 수정한 후:
1. 개발 서버를 중지 (Ctrl+C)
2. 서버를 다시 시작: `npm run dev`

## 주의사항
- 프로젝트 ID와 URL은 반드시 일치해야 합니다
- Publishable Key도 올바른 프로젝트의 키여야 합니다
- `.env` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함되어 있을 것입니다)
