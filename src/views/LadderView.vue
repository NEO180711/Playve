<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import GameOnboarding from "../components/GameOnboarding.vue";
import { generateLadder, traceLadder } from "../lib/ladder";
import { buildLadderPathPoints, interpolatePath } from "../lib/ladderPath";

const ROW_GAP = 12;

function parseCommaNames(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

const namesInput = ref("");
const names = computed(() => parseCommaNames(namesInput.value));

const options = ref<string[]>([]);

watch(
  names,
  (list) => {
    const n = list.length;
    const prev = options.value;
    const next: string[] = [];
    for (let i = 0; i < n; i++) {
      next.push(i < prev.length ? prev[i]! : "");
    }
    options.value = next;
  },
  { immediate: true }
);

const rows = ref(12);

onUnmounted(() => {
  cancelLadderAnim();
});

const rungs = ref<boolean[][] | null>(null);
const results = ref<{ name: string; goal: string }[] | null>(null);
/** 텍스트 결과 패널: 전원 내려간 뒤 또는 「바로 결과 보기」 후에만 표시 */
const resultsRevealed = ref(false);

const animProgress = ref<number[]>([]);
let ladderAnimRaf = 0;

function cancelLadderAnim() {
  if (ladderAnimRaf) cancelAnimationFrame(ladderAnimRaf);
  ladderAnimRaf = 0;
}

/** 한 명이 사다리를 타는 시간(ms) — 천천히 */
const LADDER_ANIM_MS_PER_PERSON = 6400;

function startLadderAnim(count: number) {
  cancelLadderAnim();
  animProgress.value = Array(count).fill(0);

  function easeOutCubic(t: number) {
    return 1 - (1 - t) ** 3;
  }

  let currentIndex = 0;
  let segmentStart = performance.now();

  function frame(now: number) {
    if (currentIndex >= count) {
      animProgress.value = Array(count).fill(1);
      ladderAnimRaf = 0;
      resultsRevealed.value = true;
      return;
    }

    const elapsed = now - segmentStart;
    const u = elapsed / LADDER_ANIM_MS_PER_PERSON;
    const t = u <= 0 ? 0 : u >= 1 ? 1 : easeOutCubic(u);

    const base = Array.from({ length: count }, (_, i) => {
      if (i < currentIndex) return 1;
      if (i === currentIndex) return t;
      return 0;
    });

    animProgress.value = base;

    if (t >= 1) {
      if (currentIndex >= count - 1) {
        animProgress.value = Array(count).fill(1);
        ladderAnimRaf = 0;
        resultsRevealed.value = true;
        return;
      }
      currentIndex += 1;
      segmentStart = now;
    }

    ladderAnimRaf = requestAnimationFrame(frame);
  }

  ladderAnimRaf = requestAnimationFrame(frame);
}

function skipLadderAnimToEnd() {
  const n = names.value.length;
  if (!rungs.value || n < 1) return;
  cancelLadderAnim();
  animProgress.value = Array(n).fill(1);
  resultsRevealed.value = true;
}

function displayGoalLabel(g: string) {
  const t = g.trim();
  return t || "—";
}

function copyToNext(index: number) {
  const o = [...options.value];
  if (index < 0 || index >= o.length - 1) return;
  o[index + 1] = o[index] ?? "";
  options.value = o;
}

function build() {
  const nameList = names.value;
  const goals = options.value.map((g) => g.trim());
  if (nameList.length < 2) {
    alert("참가자를 쉼표로 구분해 2명 이상 입력해 주세요.");
    return;
  }
  if (goals.length !== nameList.length) {
    alert("옵션 개수가 참가자 수와 맞지 않습니다.");
    return;
  }
  if (goals.some((g) => !g)) {
    alert("도착 옵션에 꽝, 당첨과 같은 내용을 빠짐없이 입력해 주세요.");
    return;
  }
  const cols = nameList.length;
  const rawRows = Number(rows.value);
  const r = Math.max(
    6,
    Math.min(24, Number.isFinite(rawRows) ? Math.floor(rawRows) : 12)
  );
  const g = generateLadder(cols, r);
  cancelLadderAnim();
  animProgress.value = [];
  resultsRevealed.value = false;
  rungs.value = g;
  const out: { name: string; goal: string }[] = [];
  for (let i = 0; i < cols; i++) {
    const end = traceLadder(cols, g, i);
    out.push({ name: nameList[i]!, goal: goals[end]! });
  }
  results.value = out;
  nextTick(() => startLadderAnim(cols));
}

type RungSeg = { x1: number; y: number; x2: number };

const ladderModel = computed(() => {
  if (!rungs.value || !results.value?.length) return null;
  const cols = results.value.length;
  const rgs = rungs.value;
  const rowCount = rgs.length;
  const pad = 24;
  const topH = 44;
  const bottomH = 44;
  const w = 40 + cols * 56;
  const innerH = rowCount * ROW_GAP;
  const h = topH + innerH + bottomH + pad * 2;
  const x0 = pad + 28;
  const yTop = pad + topH;
  const yBot = yTop + innerH;

  const verticals = Array.from({ length: cols }, (_, c) => ({
    x: x0 + c * 56,
    y1: yTop,
    y2: yBot,
  }));

  const horizontals: RungSeg[] = [];
  for (let ri = 0; ri < rowCount; ri++) {
    const y = yTop + ri * ROW_GAP + ROW_GAP / 2;
    for (let g = 0; g < cols - 1; g++) {
      if (rgs[ri]![g]) {
        horizontals.push({
          x1: x0 + g * 56,
          y,
          x2: x0 + (g + 1) * 56,
        });
      }
    }
  }

  const nameList = names.value;
  const goalLabels = options.value.map((g) => displayGoalLabel(g));
  const topLabels = nameList.map((n, i) => ({
    x: x0 + i * 56,
    y: pad + 22,
    text: n,
  }));
  const bottomLabels = goalLabels.map((text, j) => ({
    x: x0 + j * 56,
    y: h - pad - 12,
    text,
  }));

  const pathPointsPerPlayer = nameList.map((_, startCol) =>
    buildLadderPathPoints(cols, rgs, startCol, x0, yTop, yBot, ROW_GAP)
  );

  const playerColors = nameList.map((_, i) => {
    const hue = (i * 53 + 17) % 360;
    return `hsl(${hue}, 82%, 44%)`;
  });

  return {
    w,
    h,
    verticals,
    horizontals,
    topLabels,
    bottomLabels,
    pathPointsPerPlayer,
    playerColors,
  };
});

const animSprites = computed(() => {
  const m = ladderModel.value;
  if (!m?.pathPointsPerPlayer?.length) return [];
  const n = m.pathPointsPerPlayer.length;
  if (animProgress.value.length !== n) return [];
  const nameList = names.value;
  return m.pathPointsPerPlayer.map((pts, i) => {
    const sample = interpolatePath(pts, animProgress.value[i] ?? 0);
    const raw = nameList[i] ?? "";
    const shortName = raw.length > 6 ? `${raw.slice(0, 6)}…` : raw;
    return {
      points: sample.trail.map((p) => `${p.x},${p.y}`).join(" "),
      x: sample.x,
      y: sample.y,
      color: m.playerColors[i]!,
      shortName,
    };
  });
});

const showSkipAnimBtn = computed(() => {
  if (!ladderModel.value || !results.value?.length) return false;
  const ap = animProgress.value;
  const n = results.value.length;
  if (ap.length !== n) return false;
  return ap.some((t) => t < 1);
});

/** 사다리가 한 번 그려진 뒤(연출 중이거나 결과 확인 후) 같은 설정으로 다시 뽑기 */
const showRespinBtn = computed(() => !!(rungs.value && results.value?.length));
</script>

<template>
  <GameOnboarding
    game-key="ladder"
    intro-title="사다리타기 안내"
    help-title="사다리타기 설명서"
    fab-aria-label="사다리타기 도움말 열기"
  >
    <template #intro>
      <p class="game-intro-lead">
        참가자 이름을 <strong>쉼표</strong>로 넣고, 아래에 생기는 <strong>도착 옵션</strong>을 채운 뒤
        <strong>사다리 만들기</strong>를 누르면 됩니다.
      </p>
      <ul class="game-intro-list">
        <li>사다리가 그려지면 참가자가 <strong>한 명씩</strong> 천천히 내려가요.</li>
        <li>기다리기 싫다면 <strong>바로 결과 보기</strong>로 애니메이션을 건너뛸 수 있어요.</li>
        <li>
          맨 아래 <strong>결과</strong> 목록은 <strong>전원 내려간 뒤</strong> 또는 <strong>바로 결과 보기</strong>를
          눌렀을 때만 보여요.
        </li>
        <li>화면 <strong>오른쪽 아래 물음표(?)</strong>를 누르면 언제든지 자세한 설명서를 열 수 있어요.</li>
      </ul>
    </template>
    <template #help>
      <section class="game-help-section">
        <h3 class="game-help-section__h">사다리타기가 뭐예요?</h3>
        <p class="game-help-section__p">
          위쪽에 적은 참가자가 각자 한 세로줄에서 아래로 내려가다가, 가로줄을 만나면 옆 줄로 갈아탑니다.
          맨 아래에 적어 둔 도착 옵션 중 어느 칸에 닿는지로 결과가 정해져요. 세로줄과 가로줄을 잇는 ‘사다리’를 그려
          두고, 위에서부터 타고 내려가며 역할·당첨·벌칙 등을 나눌 때 쓰는 추첨 방식입니다.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">설정 순서</h3>
        <ol class="game-help-list">
          <li>
            <strong>참가자</strong> — 이름을 <strong>쉼표(,)</strong>로 구분해 입력합니다. 형식 예시는 입력 칸에 회색으로만
            보이는 <strong>placeholder</strong>를 참고하세요.
          </li>
          <li>
            <strong>도착 옵션</strong> — 참가자 수만큼 칸이 생깁니다. 각 칸에 무엇을 적을지는 입력란의 회색
            <strong>placeholder</strong>(꽝, 당첨과 같은 내용 안내)를 참고해 모두 채웁니다.
          </li>
          <li>
            <strong>복사</strong> — 같은 내용을 여러 칸에 넣을 때, 위 칸의 「복사」를 누르면 그 내용이 바로 아래 칸에
            그대로 붙습니다.
          </li>
          <li><strong>사다리 단계</strong> — 참가 줄과 도착 줄 사이 가로줄이 생길 수 있는 층 수입니다. (6~24)</li>
          <li>
            <strong>사다리 만들기</strong> — 무작위 가로줄로 사다리가 그려지고 연출이 재생됩니다. 맨 아래
            <strong>결과</strong> 목록은 전원이 내려간 뒤 또는 <strong>바로 결과 보기</strong> 후에 나타납니다.
          </li>
        </ol>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">애니메이션 · 바로 결과 보기 · 물음표(?)</h3>
        <p class="game-help-section__p">
          사다리를 만든 뒤에는 참가자가 <strong>한 명씩 순서대로</strong> 천천히 내려가는 연출이 재생됩니다. 전부
          기다리기 부담스럽다면 <strong>바로 결과 보기</strong> 버튼을 눌러 애니메이션을 건너뛰고, 곧바로 궤적·말을
          완성된 상태로 볼 수 있습니다.
        </p>
        <p class="game-help-section__p game-help-section__p--tight">
          맨 아래 <strong>결과</strong> 목록(이름 → 도착 옵션)은 <strong>모두 내려간 뒤</strong>이거나
          <strong>바로 결과 보기</strong>를 눌렀을 때만 나타납니다.
        </p>
        <p class="game-help-section__p game-help-section__p--tight">
          화면 <strong>오른쪽 아래의 물음표(?)</strong>는 이 설명서를 여는 버튼입니다. 안내 카드를 닫은 뒤에도 그 화면에서
          언제든 눌러 다시 읽을 수 있어요.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">사다리 단계가 뭔가요?</h3>
        <p class="game-help-section__p">
          참가자 줄과 도착 줄 <strong>사이에 가로줄이 생길 수 있는 층(행)의 개수</strong>입니다.
        </p>
        <ul class="game-help-list game-help-list--unordered">
          <li>숫자를 <strong>크게</strong> 하면 층이 많아져 사다리가 길고 가로줄이 많이 나올 수 있어요.</li>
          <li>숫자를 <strong>작게</strong> 하면 짧고 단순한 사다리가 됩니다.</li>
          <li>누가 어디로 가는지는 매번 무작위로 정해지며, 단계 수는 그 “얼마나 복잡하게 꼬일지” 정도만 바꿉니다.</li>
        </ul>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">팁</h3>
        <ul class="game-help-list game-help-list--unordered">
          <li>인원이 바뀌면 옵션 개수도 자동으로 맞춰집니다. 새로 생긴 칸은 비어 있으며, placeholder만 참고해 적어 주세요.</li>
          <li>같은 설정으로 다시 뽑고 싶으면 「사다리 만들기」를 다시 누르면 됩니다.</li>
        </ul>
      </section>
    </template>

    <div class="ladder-page">
    <header class="page__head">
      <RouterLink to="/" class="page__back">← 홈</RouterLink>
      <h1 class="page__title">사다리타기</h1>
      <p class="page__desc">
        참가자는 쉼표로 구분합니다. 도착 옵션은 참가자 수만큼 적고, 「사다리 만들기」로 무작위 사다리를 그린 뒤 연출을
        볼 수 있습니다. 같은 인원으로 다시 뽑을 때는 「다시 돌리기」를 누르면 됩니다.
      </p>
    </header>

    <div class="field">
      <label for="ladder-names">참가자 (쉼표로 구분)</label>
      <input id="ladder-names" v-model="namesInput" type="text" class="ladder-input-wide" placeholder="예: 선아,지영,현우,서연" />
    </div>

    <div v-if="names.length" class="options-block">
      <p class="options-block__title">도착 옵션 (참가자 {{ names.length }}명 → 옵션 {{ names.length }}개)</p>
      <ul class="options-list">
        <li v-for="slot in names.length" :key="slot" class="options-row">
          <span class="options-row__label">옵션 {{ slot }}</span>
          <input
            v-model="options[slot - 1]"
            type="text"
            class="options-row__input"
            placeholder="꽝, 당첨과 같은 내용을 입력해 주세요"
          />
          <button
            v-if="slot < names.length"
            type="button"
            class="options-row__copy btn btn--secondary"
            @click="copyToNext(slot - 1)"
          >
            복사
          </button>
          <span v-else class="options-row__copy-spacer" aria-hidden="true" />
        </li>
      </ul>
      <p class="options-hint">「복사」는 위 옵션 내용을 바로 아래 칸에 덮어씁니다.</p>
    </div>

    <div class="field">
      <label for="ladder-rows">사다리 단계 (6~24)</label>
      <input id="ladder-rows" v-model.number="rows" type="number" min="6" max="24" />
    </div>
    <div class="btn-row ladder-actions">
      <button type="button" class="btn btn--primary" @click="build">사다리 만들기</button>
      <button
        v-if="showSkipAnimBtn"
        type="button"
        class="btn btn--secondary"
        @click="skipLadderAnimToEnd"
      >
        바로 결과 보기
      </button>
      <button
        v-if="showRespinBtn"
        type="button"
        class="btn btn--secondary"
        @click="build"
      >
        다시 돌리기
      </button>
    </div>

    <div v-if="ladderModel" class="panel ladder-svg-wrap">
      <svg
        :viewBox="`0 0 ${ladderModel.w} ${ladderModel.h}`"
        class="ladder-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          v-for="(v, i) in ladderModel.verticals"
          :key="'v' + i"
          :x1="v.x"
          :y1="v.y1"
          :x2="v.x"
          :y2="v.y2"
          stroke="#1a1d24"
          stroke-width="2"
        />
        <line
          v-for="(seg, i) in ladderModel.horizontals"
          :key="'h' + i"
          :x1="seg.x1"
          :y1="seg.y"
          :x2="seg.x2"
          :y2="seg.y"
          stroke="#3d5cff"
          stroke-width="3"
          stroke-linecap="round"
        />
        <g v-if="animSprites.length" class="ladder-anim-trails" aria-hidden="true">
          <polyline
            v-for="(s, i) in animSprites"
            :key="'trail-' + i"
            :points="s.points"
            fill="none"
            :stroke="s.color"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.92"
            class="ladder-anim-trails__line"
          />
        </g>
        <text
          v-for="(t, i) in ladderModel.topLabels"
          :key="'t' + i"
          :x="t.x"
          :y="t.y"
          text-anchor="middle"
          font-size="13"
          font-weight="700"
          fill="#ff5c00"
        >
          {{ t.text }}
        </text>
        <text
          v-for="(t, i) in ladderModel.bottomLabels"
          :key="'b' + i"
          :x="t.x"
          :y="t.y"
          text-anchor="middle"
          font-size="12"
          font-weight="600"
          fill="#3d5cff"
        >
          {{ t.text }}
        </text>
        <g v-if="animSprites.length" class="ladder-anim-markers" aria-hidden="true">
          <g v-for="(s, i) in animSprites" :key="'mk-' + i">
            <circle
              :cx="s.x"
              :cy="s.y"
              r="8"
              :fill="s.color"
              stroke="#ffffff"
              stroke-width="2"
              class="ladder-anim-markers__dot"
            />
            <text
              :x="s.x"
              :y="s.y - 14"
              text-anchor="middle"
              font-size="11"
              font-weight="800"
              fill="#1a1d24"
              class="ladder-anim-markers__name"
            >
              {{ s.shortName }}
            </text>
          </g>
        </g>
      </svg>
    </div>

    <div v-if="results?.length && resultsRevealed" class="panel ladder-results-panel">
      <p style="margin: 0 0 0.75rem; font-weight: 700">결과</p>
      <ul class="result-list">
        <li v-for="(r, i) in results" :key="i">
          <strong>{{ r.name }}</strong>
          <span>→ {{ displayGoalLabel(r.goal) }}</span>
        </li>
      </ul>
    </div>
    </div>
  </GameOnboarding>
</template>

<style scoped>
.ladder-page {
  position: relative;
}

.ladder-input-wide {
  width: 100%;
  max-width: 100%;
}

.options-block {
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.85rem;
}

.options-block__title {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-muted);
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.options-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.options-row__label {
  flex: 0 0 4.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--secondary);
}

.options-row__input {
  flex: 1 1 140px;
  min-width: 0;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: #fff;
  color: var(--text);
  font: inherit;
}

.options-row__input::placeholder {
  color: var(--text-muted);
  opacity: 0.9;
}

.options-row__input:focus {
  outline: 2px solid rgba(61, 92, 255, 0.35);
  outline-offset: 1px;
}

.options-row__copy {
  flex: 0 0 auto;
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
}

.options-row__copy-spacer {
  width: 4.5rem;
  flex-shrink: 0;
}

@media (max-width: 420px) {
  .options-row {
    flex-direction: column;
    align-items: stretch;
  }

  .options-row__label {
    flex: none;
  }

  .options-row__copy {
    width: 100%;
    min-height: 2.75rem;
  }

  .options-row__copy-spacer {
    display: none;
  }
}

.options-hint {
  margin: 0.65rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.ladder-svg-wrap {
  overflow-x: auto;
}

.ladder-svg {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  min-height: 200px;
}

.ladder-anim-trails__line {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12));
  pointer-events: none;
}

.ladder-anim-markers {
  pointer-events: none;
}

.ladder-anim-markers__name {
  paint-order: stroke fill;
  stroke: #fff;
  stroke-width: 3px;
  stroke-linejoin: round;
}

.result-list {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--text-muted);
}

.result-list li {
  margin-bottom: 0.35rem;
}

.result-list strong {
  color: var(--text);
  margin-right: 0.35rem;
}
</style>
