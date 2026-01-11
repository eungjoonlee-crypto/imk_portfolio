# 아티스트 포트레이트 이미지 추가 가이드

## 현재 상태
About 섹션의 Artist Portrait placeholder가 실제 이미지를 표시하도록 수정되었습니다.

## 이미지 추가 방법

### 방법 1: Public 폴더에 이미지 추가 (권장)

1. **이미지 파일 준비**
   - 권장 비율: 3:4 (세로형 포트레이트)
   - 권장 해상도: 최소 1200x1600px 이상
   - 파일 형식: JPG, PNG, WEBP

2. **파일 위치**
   ```
   public/artist-portrait.jpg
   ```

3. **파일 이름**
   - 현재 코드는 `/artist-portrait.jpg`를 참조합니다
   - 다른 이름으로 저장했다면 `AboutSection.tsx`의 `src` 경로를 수정하세요

### 방법 2: src/assets 폴더에 이미지 추가

1. **이미지 파일을 src/assets에 추가**
   ```
   src/assets/artist-portrait.jpg
   ```

2. **AboutSection.tsx 파일 수정**
   ```typescript
   // 파일 상단에 import 추가
   import artistPortrait from "@/assets/artist-portrait.jpg";
   
   // 그리고 img 태그의 src를 변경
   <img
     src={artistPortrait}
     alt="Artist Portrait"
     className="w-full h-full object-cover"
     onError={() => setImageError(true)}
   />
   ```

## 현재 구현

현재 코드는 다음 순서로 이미지를 찾습니다:
1. `/artist-portrait.jpg` (public 폴더)
2. 이미지 로드 실패 시 placeholder 표시

## 이미지 파일 추가 후

1. 이미지 파일을 `public/artist-portrait.jpg`로 저장하거나
2. `src/assets/artist-portrait.jpg`로 저장하고 코드 수정

이미지를 추가하면 자동으로 표시됩니다!

