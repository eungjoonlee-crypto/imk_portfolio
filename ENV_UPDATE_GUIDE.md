# .env 파일 업데이트 가이드

## 현재 문제
`.env` 파일의 프로젝트 ID가 올바른 프로젝트 ID와 다릅니다.

## 업데이트 방법

`.env` 파일을 열어 다음 값들을 업데이트하세요:

```bash
# 올바른 프로젝트 ID로 변경
VITE_SUPABASE_PROJECT_ID="gotdcbpobucrspqwyqgb"
VITE_SUPABASE_URL="https://gotdcbpobucrspqwyqgb.supabase.co"

# Publishable Key는 Supabase Dashboard에서 확인 필요
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"
```

## Publishable Key 확인 방법
1. Supabase Dashboard 접속: https://supabase.com/dashboard
2. 프로젝트 `gotdcbpobucrspqwyqgb` 선택
3. Settings → API 메뉴
4. "Project API keys" 섹션에서 `anon` 또는 `public` 키 복사

## 주의사항
- `.env` 파일을 수정한 후 개발 서버를 재시작해야 합니다
- 프로젝트 ID와 URL은 일치해야 합니다

