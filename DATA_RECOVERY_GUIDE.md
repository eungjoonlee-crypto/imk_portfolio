# 데이터 복구 가이드

## 현재 상황
마이그레이션 과정에서 `artworks` 테이블이 재생성되면서 이전 데이터가 삭제되었습니다.

## 복구 가능성 확인

### 1. Supabase 자동 백업 확인 (권장)

Supabase는 **Pro 플랜 이상**에서 자동 백업을 제공합니다:

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 `gotdcbpobucrspqwyqgb` 선택

2. **Database → Backups 메뉴 확인**
   - 왼쪽 메뉴에서 "Database" → "Backups" 선택
   - Point-in-Time Recovery (PITR) 백업이 있다면 복구 가능
   - 최근 백업 날짜 확인

3. **백업이 있는 경우 복구 방법**
   - "Restore" 또는 "Recover" 버튼 클릭
   - 삭제 전 시점 선택 (약 1-2시간 전 추정)
   - 복구 실행

### 2. SQL 덤프 확인

만약 이전에 SQL 덤프를 받아둔 경우:
1. SQL 덤프 파일 위치 확인
2. 필요한 테이블 데이터만 복구

### 3. 무료 플랜인 경우

무료 플랜에서는 자동 백업이 제한적일 수 있습니다:
- ❌ Point-in-Time Recovery 없음
- ❌ 자동 백업 없음
- ✅ 수동 SQL 덤프만 가능 (이미 받아둔 경우)

## 대안 방법

### 1. Storage 이미지 확인
이미지 파일은 Storage에 남아있을 수 있습니다:
- Supabase Dashboard → Storage → `artworks` 버킷 확인
- 이미지 파일이 있다면 작품 정보를 수동으로 복구할 수 있습니다

### 2. 코드에서 Fallback 데이터 확인
`src/components/GallerySection.tsx`에 fallback 이미지가 있는지 확인

## 현재 프로젝트 ID 확인

⚠️ **주의**: `.env` 파일과 `supabase/config.toml`의 프로젝트 ID가 다릅니다:
- `.env`: `gcpdcotbvsvyuthqhxoi`
- `supabase/config.toml`: `gotdcbpobucrspqwyqgb`

올바른 프로젝트 ID를 확인하고 통일해야 합니다.

## 복구 불가능한 경우

데이터 복구가 불가능하다면:
1. 새로운 작품을 등록하여 다시 시작
2. 관리자 페이지(`/admin`)에서 작품 등록 시작
3. 이미지가 Storage에 남아있다면, 이미지를 다시 연결

## 예방 방법

향후를 위한 권장 사항:
1. **정기적인 SQL 덤프 백업**
   ```bash
   # Supabase CLI 사용
   supabase db dump -f backup.sql
   ```

2. **Pro 플랜 업그레이드 고려**
   - 자동 백업 제공
   - Point-in-Time Recovery 지원

3. **마이그레이션 전 백업**
   - 테이블 변경 전 항상 백업
   - 데이터 마이그레이션 스크립트 작성
