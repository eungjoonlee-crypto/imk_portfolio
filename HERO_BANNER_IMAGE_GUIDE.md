# Hero 섹션 배너 이미지 추가 가이드

## 현재 설정

Hero 섹션 우측의 gradient 박스를 "IMK_HANNAM" 배너 이미지로 교체하기 위해 코드가 수정되었습니다.

## 이미지 파일 추가 방법

### 방법 1: Public 폴더에 이미지 추가 (권장)

1. **이미지 파일 준비**
   - 파일명: `imk-hannam-banner.jpg` (또는 .png, .webp)
   - 권장 해상도: 1200x1600px 이상
   - 파일 형식: JPG, PNG, WEBP

2. **파일 위치**
   ```
   public/imk-hannam-banner.jpg
   ```

3. **다른 파일명 사용 시**
   - `HeroBanner.tsx`에서 `src="/imk-hannam-banner.jpg"` 부분을 실제 파일명으로 수정

### 방법 2: src/assets 폴더에 이미지 추가

1. **이미지 파일을 src/assets에 추가**
   ```
   src/assets/imk-hannam-banner.jpg
   ```

2. **HeroBanner.tsx 파일 수정**
   ```typescript
   // 파일 상단에 import 추가
   import imkHannamBanner from "@/assets/imk-hannam-banner.jpg";
   
   // img 태그의 src 변경
   <img
     src={imkHannamBanner}
     alt="IMK Hannam Atelier"
     className="w-full h-full object-cover object-center"
     ...
   />
   ```

### 방법 3: Supabase Storage 사용

1. **이미지를 Supabase Storage에 업로드**
   - Storage → `artworks` 버킷 또는 새 버킷 생성

2. **HeroBanner.tsx에서 URL 사용**
   ```typescript
   src="https://gotdcbpobucrspqwyqgb.supabase.co/storage/v1/object/public/artworks/imk-hannam-banner.jpg"
   ```

## 현재 코드 상태

현재 코드는 다음 순서로 이미지를 찾습니다:
1. `/imk-hannam-banner.jpg` (public 폴더)
2. 이미지 로드 실패 시 gradient fallback

## 이미지 파일 추가 후

이미지 파일을 `public/imk-hannam-banner.jpg`로 저장하면 자동으로 표시됩니다!

## 참고

이미지는 다음 스타일이 적용됩니다:
- `object-cover`: 비율 유지하며 영역 채우기
- `rounded-l-3xl`: 좌측 모서리만 둥글게
- `brightness(0.95) contrast(1.05)`: 약간의 필터 효과
- 그림자 효과: 깊이감을 위한 그림자
