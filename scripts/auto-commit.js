#!/usr/bin/env node

/**
 * 자동 커밋 스크립트
 * 파일 변경사항을 감지하고 자동으로 Git에 커밋합니다.
 */

import chokidar from 'chokidar';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 무시할 디렉토리 및 파일 패턴
const ignorePatterns = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/*.log',
  '**/.DS_Store',
  '**/coverage/**',
  '**/.next/**',
];

// 감시할 파일 패턴
const watchPatterns = [
  'src/**/*',
  'public/**/*',
  '*.json',
  '*.ts',
  '*.tsx',
  '*.js',
  '*.jsx',
  '*.css',
  '*.html',
  '*.md',
  '*.toml',
  'tailwind.config.*',
  'vite.config.*',
  'tsconfig*.json',
  'components.json',
];

// 커밋 메시지 생성 함수
function generateCommitMessage(changedFiles) {
  const fileCount = changedFiles.length;
  const timestamp = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (fileCount === 1) {
    const fileName = path.basename(changedFiles[0]);
    return `Auto commit: ${fileName} 변경 (${timestamp})`;
  }
  return `Auto commit: ${fileCount}개 파일 변경 (${timestamp})`;
}

// Git 커밋 실행 함수
function performCommit(changedFiles) {
  try {
    // 변경된 파일이 있는지 확인
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    
    if (!status.trim()) {
      console.log('✅ 변경사항이 없습니다.');
      return;
    }

    // 모든 변경사항 스테이징
    console.log('📦 변경사항을 스테이징 중...');
    execSync('git add -A', { stdio: 'inherit' });

    // 커밋 메시지 생성 및 커밋
    const commitMessage = generateCommitMessage(changedFiles);
    console.log(`💾 커밋 중: ${commitMessage}`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    console.log('✅ 자동 커밋 완료!\n');
  } catch (error) {
    // Git 오류 처리 (예: 변경사항이 없거나, 커밋 실패 등)
    if (error.message.includes('nothing to commit')) {
      console.log('✅ 커밋할 변경사항이 없습니다.\n');
    } else {
      console.error('❌ 커밋 중 오류 발생:', error.message);
    }
  }
}

// Debounce를 위한 타이머 관리
let commitTimer = null;
const DEBOUNCE_DELAY = 3000; // 3초 대기 (추가 변경이 없으면 커밋)

// 변경된 파일 추적
const changedFilesSet = new Set();

// 파일 변경 핸들러
function handleFileChange(filePath) {
  // 무시할 패턴 체크
  const shouldIgnore = ignorePatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });

  if (shouldIgnore) {
    return;
  }

  changedFilesSet.add(filePath);
  console.log(`📝 변경 감지: ${filePath}`);

  // 기존 타이머 취소
  if (commitTimer) {
    clearTimeout(commitTimer);
  }

  // 새 타이머 설정 (3초 후 커밋)
  commitTimer = setTimeout(() => {
    const files = Array.from(changedFilesSet);
    changedFilesSet.clear();
    performCommit(files);
  }, DEBOUNCE_DELAY);
}

// 메인 실행 함수
function main() {
  console.log('🚀 자동 커밋 스크립트 시작...\n');
  console.log('📁 감시 중인 디렉토리:', process.cwd());
  console.log('⏱️  변경 감지 후 3초 대기 후 자동 커밋합니다.\n');

  // 파일 감시 시작
  const watcher = chokidar.watch(watchPatterns, {
    ignored: ignorePatterns,
    persistent: true,
    ignoreInitial: true, // 초기 스캔 시 이벤트 무시
    awaitWriteFinish: {
      stabilityThreshold: 500, // 파일 쓰기가 완료될 때까지 500ms 대기
      pollInterval: 100,
    },
  });

  watcher
    .on('add', handleFileChange)
    .on('change', handleFileChange)
    .on('unlink', handleFileChange)
    .on('error', error => console.error('❌ 파일 감시 오류:', error))
    .on('ready', () => {
      console.log('✅ 파일 감시 준비 완료. 파일 변경을 감지하면 자동으로 커밋합니다.\n');
      console.log('프로그램을 종료하려면 Ctrl+C를 누르세요.\n');
    });

  // 프로세스 종료 시 정리
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  자동 커밋 스크립트 종료 중...');
    watcher.close();
    
    // 마지막 변경사항 커밋
    if (changedFilesSet.size > 0) {
      const files = Array.from(changedFilesSet);
      console.log('💾 남은 변경사항 커밋 중...');
      performCommit(files);
    }
    
    process.exit(0);
  });
}

// 스크립트 실행
main();

