# Git 원격 저장소 설정 가이드

## 현재 상태
✅ **커밋 완료**: 모든 변경사항이 로컬에 커밋되었습니다.
❌ **원격 저장소 없음**: 푸시할 원격 저장소가 설정되어 있지 않습니다.

## 원격 저장소 설정 방법

### GitHub 사용 시

1. **GitHub에서 새 저장소 생성**
   - https://github.com/new 접속
   - 저장소 이름 입력 (예: `imk-portfolio`)
   - Public 또는 Private 선택
   - "Initialize this repository with a README" 체크 해제
   - "Create repository" 클릭

2. **로컬 저장소에 원격 추가**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/imk-portfolio.git
   ```

3. **푸시**
   ```bash
   git push -u origin master
   ```

### 기존 원격 저장소가 있는 경우

```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 추가 (예: GitHub)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 푸시
git push -u origin master
```

## 주의사항

### .env 파일
⚠️ **중요**: `.env` 파일이 커밋에 포함되었습니다. 보안상 민감한 정보가 포함되어 있을 수 있으므로:

1. `.env` 파일을 `.gitignore`에 추가했는지 확인
2. 이미 커밋된 `.env` 파일 제거 (필요한 경우):
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from version control"
   ```

3. `.env.example` 파일을 사용하여 환경 변수 템플릿 제공 (이미 생성됨)

## 다음 단계

원격 저장소를 설정한 후:
```bash
git push -u origin master
```

위 명령으로 변경사항을 푸시할 수 있습니다.
