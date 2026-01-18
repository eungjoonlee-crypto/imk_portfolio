# 데이터 복구 요약

## 현재 상황
✅ **로컬 서버 실행 중**: http://localhost:8080
❌ **DB 데이터 복구**: 어려움 (테이블이 재생성됨)

## 확인 사항

### 1. 프로젝트 ID 불일치
`.env` 파일과 `supabase/config.toml`의 프로젝트 ID가 다릅니다.
- 올바른 프로젝트 ID: `gotdcbpobucrspqwyqgb`
- `.env` 파일 업데이트 필요

### 2. 데이터 복구 가능성
- ❌ **무료 플랜**: 자동 백업 없음 → 복구 어려움
- ✅ **Pro 플랜 이상**: Dashboard → Database → Backups에서 확인 가능
- ✅ **Storage**: 이미지 파일이 남아있을 수 있음 (확인 필요)

### 3. Fallback 데이터
코드에 fallback 이미지가 있습니다:
- `src/assets/artwork-1.jpg` ~ `artwork-6.jpg`
- 데이터베이스가 비어있을 때 표시됨

## 다음 단계

1. **Supabase Dashboard에서 백업 확인**
   - https://supabase.com/dashboard
   - 프로젝트 `gotdcbpobucrspqwyqgb` 선택
   - Database → Backups 메뉴 확인

2. **Storage 확인**
   - Storage → `artworks` 버킷 확인
   - 이미지 파일이 있다면 작품 정보를 수동으로 복구 가능

3. **새로 시작 (백업이 없는 경우)**
   - 관리자 페이지(`/admin`)에서 새 작품 등록
   - 기존 이미지가 Storage에 있다면 재연결

## 권장 사항
- 정기적인 SQL 덤프 백업 생성
- 마이그레이션 전 항상 백업
- Pro 플랜 업그레이드 고려 (자동 백업 제공)
