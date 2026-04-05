# Playve 프로젝트 구조

Vue 3 + Vite + TypeScript 미니게임 웹앱의 디렉터리와 파일 역할을 정리합니다.

## 파일 트리

```
Playve/
├── .gitignore                 # Git 제외 목록 (node_modules, dist 등)
├── dev.cmd                    # Windows: PATH 갱신 후 npm install + dev (더블클릭 가능)
├── index.html                 # Vite 진입 HTML, 폰트·파비콘 링크
├── package.json               # 의존성·npm 스크립트 (dev / build / preview)
├── PROJECT_STRUCTURE.md       # 본 문서 (구조·파일 설명)
├── tsconfig.json              # TypeScript 컴파일 옵션 (src 기준)
├── tsconfig.node.json         # Node 전용 TS 설정 (Vite 설정 파일용)
├── vite.config.ts             # Vite 플러그인·빌드 설정 (Vue 플러그인)
│
├── scripts/
│   └── playve-dev.ps1         # PowerShell: Machine/User PATH 재로드 후 npm install·dev
│
├── public/
│   └── favicon.svg            # 브라우저 탭 아이콘 (오렌지 브랜드 마크)
│
└── src/
    ├── App.vue                # 루트 컴포넌트: 레이아웃 + 페이지 슬롯
    ├── main.ts                # 앱 부트스트랩: createApp, router, 전역 CSS
    ├── env.d.ts               # Vite·Vue SFC 타입 선언 (*.vue 모듈)
    │
    ├── assets/
    │   └── main.css           # 전역 스타일·CSS 변수(색상)·공통 유틸 클래스
    │
    ├── components/
    │   └── AppLayout.vue      # 헤더·내비·메인 영역 래퍼 (sticky 상단바)
    │
    ├── lib/
    │   ├── ladder.ts          # 사다리 가로줄 생성·경로 추적(시작열→도착열)
    │   ├── ladderPath.ts      # 사다리 좌표 꺾은선·진행률 보간(애니메이션용)
    │   └── lines.ts           # 텍스트를 줄 단위로 나누는 헬퍼
    │
    ├── router/
    │   └── index.ts           # Vue Router 라우트 정의 (경로 ↔ 뷰 매핑)
    │
    └── views/
        ├── HomeView.vue       # 랜딩: 게임 카드 그리드·소개 카피
        ├── LadderView.vue     # 사다리타기 UI·SVG 렌더
        ├── WheelView.vue      # 룰렛(원판)·항목 입력·회전 애니메이션
        ├── PaperDrawView.vue  # 제비뽑기: 섞기·카드 뒤집기
        ├── NumberView.vue     # 범위 내 랜덤 정수
        ├── CoinView.vue       # 동전 앞/뒤·3D 느낌 회전
        └── NamePickerView.vue # 명단에서 한 명 강조 추첨
```

## 빌드 시 생기는 항목 (저장소에 없을 수 있음)

| 경로 | 설명 |
|------|------|
| `node_modules/` | `npm install`로 설치되는 패키지 |
| `dist/` | `npm run build` 결과 정적 파일 |
| `package-lock.json` | npm이 생성하는 잠금 파일(설치 이력에 따라 존재) |

## 파일별 역할 요약

| 파일 | 설명 |
|------|------|
| `.gitignore` | `node_modules`, `dist` 등 버전 관리에서 제외 |
| `dev.cmd` | Windows에서 `scripts/playve-dev.ps1` 호출; Node 설치 직후 PATH 미반영 문제 완화 |
| `scripts/playve-dev.ps1` | PATH 갱신 + 일반적인 Node 설치 폴더에서 `npm.cmd` 탐색 후 `npm install`·`npm run dev` |
| `index.html` | `#app` 마운트 지점, `main.ts` 로드, 메타·폰트 |
| `package.json` | `vue`, `vue-router`, `vite`, `vue-tsc` 등 의존성 정의 |
| `tsconfig.json` | `src`의 TS/Vue 소스에 적용되는 엄격 모드 등 |
| `tsconfig.node.json` | `vite.config.ts`만 타겟으로 할 때 사용 |
| `vite.config.ts` | `@vitejs/plugin-vue`로 `.vue` SFC 처리 |
| `public/favicon.svg` | 정적 자산, 빌드 시 루트 URL로 그대로 복사 |
| `src/main.ts` | Vue 앱 생성, `router` 등록, `main.css` import |
| `src/App.vue` | `AppLayout`로 감싼 `RouterView` (페이지 전환) |
| `src/env.d.ts` | `import x from '*.vue'` 타입 인식 |
| `src/assets/main.css` | `--point`, `--secondary`, `.btn`, `.panel` 등 공통 UI |
| `src/components/AppLayout.vue` | 로고, 게임별 `RouterLink`, 활성 링크 스타일 |
| `src/router/index.ts` | `/`, `/ladder`, `/wheel`, `/paper`, `/number`, `/coin`, `/names` |
| `src/lib/ladder.ts` | 사다리 횡단선 배열 생성, 시작 열에서의 도착 열 계산 |
| `src/lib/ladderPath.ts` | `traceLadder`와 동일 규칙의 SVG 좌표 경로, 진행률 t에 따른 위치·궤적 |
| `src/lib/lines.ts` | 줄바꿈으로 split 후 공백 제거·빈 줄 제거 |
| `src/views/HomeView.vue` | 각 게임으로 이동하는 카드 목록 |
| `src/views/LadderView.vue` | 참가자(쉼표)·도착 옵션 N개·옵션 간 복사, SVG 사다리·결과 |
| `src/views/WheelView.vue` | conic-gradient 원판, 돌리기 버튼, 당첨 하이라이트 |
| `src/views/PaperDrawView.vue` | 제비 문장 입력, 셔플, 그리드에서 한 장씩 공개 |
| `src/views/NumberView.vue` | 최소·최대 숫자, 뽑기 결과 큰 숫자 표시 |
| `src/views/CoinView.vue` | `rotateY` 기반 동전, 앞면/뒷면 문구 |
| `src/views/NamePickerView.vue` | 이름 목록, 빠른 하이라이트 후 당첨자 강조 |
