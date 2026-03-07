# ERR_BLOCKED_BY_CLIENT (Google Tag Manager) 해결

## 원인

콘솔/네트워크에 다음 요청이 **차단됨**으로 나옵니다.

- **URL**: `https://www.googletagmanager.com/gtag/js?id=G-8BV38XT3V0`
- **의미**: Google Analytics(gtag) 스크립트를 브라우저 확장 프로그램(광고 차단기 등)이 막은 상태입니다.
- **이 프로젝트**: `index.html`과 소스에는 **gtag 스크립트가 없습니다.**

그래서 아래 둘 중 하나일 가능성이 큽니다.

1. **배포 환경에서 스크립트가 들어감**  
   (Vercel/Netlify 등에서 Google Analytics 연동을 켜두었거나, 빌드 시 주입)
2. **예전에 직접 넣었던 스크립트가 배포본에만 남아 있음**  
   (로컬 `index.html`은 수정했지만, 배포용 HTML에는 아직 포함)

## 해결 방법

### 1) Google Analytics를 쓰지 않을 때 (권장)

- **Vercel**  
  - 프로젝트 → **Settings** → **Analytics** / **Integrations**  
  - Google Analytics 연동이 켜져 있으면 **끄기**.
- **Netlify**  
  - **Site configuration** → **Analytics** / 플러그인에서 Google Analytics **제거**.
- **직접 수정한 `index.html`로 배포하는 경우**  
  - 배포에 사용하는 `index.html`을 열어서  
    `googletagmanager.com` / `gtag` / `G-8BV38XT3V0` 가 들어 있는 `<script>` 태그를 **완전히 삭제**한 뒤 다시 배포.

이렇게 하면 해당 요청 자체가 사라져서 **ERR_BLOCKED_BY_CLIENT**도 같이 사라집니다.

### 2) Google Analytics를 꼭 쓸 때

- 광고 차단기를 쓰는 사용자에서는 어차피 gtag가 막히므로, **콘솔 에러만 안 보이게** 하고 싶다면:
  - gtag를 **`<head>`에 직접 두지 말고**,
  - 필요할 때만 **JavaScript로 동적 로드**하고, 로드 실패 시 `onerror` 등으로 무시하도록 구현하면 됩니다.
- 이 경우에도 **차단기 사용자에게는 분석이 되지 않는다**는 점은 그대로입니다.

## 정리

- **에러를 없애려면**: gtag 스크립트를 **어디에서든 제거**하거나, 호스팅 연동을 끄면 됩니다.
- **현재 이 저장소의 `index.html`**에는 gtag를 넣지 않았고, 주석으로 “head에 analytics 스크립트 넣지 말 것”을 적어 두었습니다.
