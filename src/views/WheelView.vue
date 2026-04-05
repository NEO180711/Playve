<script setup lang="ts">
import { ref, computed } from "vue";
import GameOnboarding from "../components/GameOnboarding.vue";

function parseCommaItems(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** 사다리와 같이 쉼표로 구분 — 예시 문구는 placeholder로만 표시 */
const itemsInput = ref("");
const rotation = ref(0);
const spinning = ref(false);
const displayResult = ref<string | null>(null);
const pointerKick = ref(false);

/** 참고 디자인과 비슷한 파스텔 팔레트 (항목 수만큼 순환) */
const SEGMENT_FILLS = [
  "#a8d8ea",
  "#b8e994",
  "#ffeaa7",
  "#fab1a0",
  "#ff8a8a",
  "#d7c8e8",
];

const items = computed(() => parseCommaItems(itemsInput.value));

const n = computed(() => items.value.length);

type SliceGeom = {
  path: string;
  labelX: number;
  labelY: number;
  labelRotate: number;
  fill: string;
};

const slices = computed((): SliceGeom[] => {
  const count = n.value;
  const r = 92;
  const labelR = 58;
  const out: SliceGeom[] = [];
  for (let i = 0; i < count; i++) {
    const s = (i / count) * 2 * Math.PI - Math.PI / 2;
    const e = ((i + 1) / count) * 2 * Math.PI - Math.PI / 2;
    const x1 = r * Math.cos(s);
    const y1 = r * Math.sin(s);
    const x2 = r * Math.cos(e);
    const y2 = r * Math.sin(e);
    const largeArc = e - s > Math.PI ? 1 : 0;
    const path = `M 0 0 L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
    const mid = s + (e - s) / 2;
    const labelX = labelR * Math.cos(mid);
    const labelY = labelR * Math.sin(mid);
    const labelRotate = (mid * 180) / Math.PI + 90;
    out.push({
      path,
      labelX,
      labelY,
      labelRotate,
      fill: SEGMENT_FILLS[i % SEGMENT_FILLS.length]!,
    });
  }
  return out;
});

let pointerKickTimer = 0;

function triggerPointerKick() {
  pointerKick.value = true;
  if (pointerKickTimer) window.clearTimeout(pointerKickTimer);
  pointerKickTimer = window.setTimeout(() => {
    pointerKick.value = false;
    pointerKickTimer = 0;
  }, 55);
}

function spin() {
  if (spinning.value) return;
  const list = parseCommaItems(itemsInput.value);
  if (list.length < 2) {
    alert("룰렛 항목을 쉼표로 구분해 2개 이상 입력해 주세요.");
    return;
  }
  const count = list.length;
  const idx = Math.floor(Math.random() * count);
  const slice = 360 / count;
  const center = idx * slice + slice / 2;
  const target = 360 * 6 + (360 - center);
  spinning.value = true;
  displayResult.value = null;
  rotation.value = rotation.value % 360;
  const start = rotation.value;
  const delta = target - (start % 360) + 360 * 5;
  const end = start + delta;
  const duration = 4800;
  const t0 = performance.now();
  let lastBucket = Math.floor((((start % 360) + 360) % 360) / slice);

  function easeOutQuint(t: number) {
    return 1 - (1 - t) ** 5;
  }

  function frame(now: number) {
    const u = Math.min(1, (now - t0) / duration);
    const t = easeOutQuint(u);
    const rot = start + delta * t;
    rotation.value = rot;

    const norm = ((rot % 360) + 360) % 360;
    const bucket = Math.floor(norm / slice) % count;
    if (bucket !== lastBucket) {
      lastBucket = bucket;
      triggerPointerKick();
    }

    if (u < 1) requestAnimationFrame(frame);
    else {
      spinning.value = false;
      rotation.value = end;
      displayResult.value = list[idx] ?? "";
    }
  }
  requestAnimationFrame(frame);
}
</script>

<template>
  <GameOnboarding
    game-key="wheel"
    intro-title="원판 돌리기 안내"
    help-title="원판 돌리기 설명서"
    fab-aria-label="원판 돌리기 도움말 열기"
  >
    <template #intro>
      <p class="game-intro-lead">
        룰렛 항목을 <strong>쉼표(,)</strong>로 구분해 적을 수 있어요 (사다리의 참가자 입력과 같아요).
        <strong>다시돌리기</strong>로 돌리면 멈출 때 <strong>맨 위 빨간 삼각형</strong> 아래 칸이 당첨입니다.
      </p>
      <ul class="game-intro-list">
        <li>항목은 <strong>2개 이상</strong>이어야 돌릴 수 있어요.</li>
        <li>돌아가는 동안에는 입력과 버튼이 잠겨요.</li>
        <li>결과는 원판 위 <strong>큰 글씨</strong>로도 보여요.</li>
        <li>화면 <strong>오른쪽 아래 ?</strong>에서 자세한 설명을 다시 볼 수 있어요.</li>
      </ul>
    </template>
    <template #help>
      <section class="game-help-section">
        <h3 class="game-help-section__h">어떻게 쓰나요?</h3>
        <p class="game-help-section__p">
          상단 입력 칸에 문구를 <strong>쉼표(,)</strong>로 구분해 적습니다. 형식 예시는 입력 칸에 회색으로만 보이는
          <strong>placeholder</strong>를 참고하세요. 「다시돌리기」로 돌리면 원판이 감속하며 멈추고, 12시 방향 표시 아래
          조각이 결과입니다. 항목 개수가 바뀌면 조각 수와 색도 같이 바뀝니다.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">무작위</h3>
        <p class="game-help-section__p">
          멈추는 위치는 브라우저 난수로 정해지며, 칸마다 나올 확률은 대략 같습니다.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">팁</h3>
        <ul class="game-help-list game-help-list--unordered">
          <li>항목은 언제든지 입력 칸에서 고칠 수 있어요. 돌아가는 중에는 수정할 수 없어요.</li>
          <li>짧은 문구 여러 개를 쉼표로 나열해 두고 여러 번 돌리면 됩니다.</li>
        </ul>
      </section>
    </template>

    <div class="wheel-page">
      <header class="page__head">
        <RouterLink to="/" class="page__back">← 홈</RouterLink>
        <h1 class="page__title">원판 돌리기 (룰렛)</h1>
        <p class="page__desc">
          항목은 쉼표로 구분합니다 (사다리타기의 참가자 입력과 같습니다). 개수만큼 조각이 나뉘며, 위쪽 문구로 결과를
          확인합니다.
        </p>
      </header>

      <div class="field">
        <label for="wheel-items">룰렛 항목 (쉼표로 구분)</label>
        <input
          id="wheel-items"
          v-model="itemsInput"
          type="text"
          class="wheel-input-wide"
          :disabled="spinning"
          placeholder="예: 선아,지영,현우,서연"
        />
        <p class="wheel-items-hint">
          <template v-if="items.length">
            현재 <strong>{{ items.length }}</strong>개 조각 · 쉼표마다 한 칸으로 나뉩니다.
          </template>
          <template v-else>항목을 입력하면 조각이 생깁니다. 예시는 입력 칸의 회색 글씨(placeholder)만 참고하세요.</template>
        </p>
      </div>

      <div class="wheel-stage">
        <p
          v-if="displayResult != null && displayResult !== ''"
          class="wheel-quote"
          :key="displayResult"
        >
          <span class="wheel-quote__inner">"{{ displayResult }}"</span>
        </p>
        <p v-else class="wheel-quote wheel-quote--muted" aria-live="polite">
          <span v-if="spinning" class="wheel-quote__inner">돌아가는 중…</span>
          <span v-else-if="items.length < 2" class="wheel-quote__inner">항목을 입력한 뒤 돌려 주세요</span>
          <span v-else class="wheel-quote__inner">다시돌리기를 눌러 주세요</span>
        </p>

        <div class="wheel-frame">
          <div class="wheel-pointer" :class="{ 'wheel-pointer--spinning': spinning }" aria-hidden="true">
            <div class="wheel-pointer__tri" :class="{ 'wheel-pointer__tri--kick': pointerKick }" />
          </div>
          <svg
            class="wheel-svg"
            viewBox="-100 -100 200 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g
              class="wheel-rotor"
              :style="{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '0px 0px',
              }"
            >
              <template v-for="(sl, i) in slices" :key="i">
                <path :d="sl.path" :fill="sl.fill" stroke="#5c4a3a" stroke-width="0.6" stroke-linejoin="round" />
                <text
                  class="wheel-svg__label"
                  :x="sl.labelX"
                  :y="sl.labelY"
                  :transform="`rotate(${sl.labelRotate}, ${sl.labelX}, ${sl.labelY})`"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  {{ items[i] }}
                </text>
              </template>
              <circle cx="0" cy="0" r="5" class="wheel-svg__hub" />
            </g>
            <circle cx="0" cy="0" r="98" class="wheel-svg__rim" fill="none" pointer-events="none" />
          </svg>
        </div>

        <div class="wheel-actions">
          <button type="button" class="wheel-btn wheel-btn--spin" :disabled="spinning" @click="spin">
            {{ spinning ? "돌아가는 중…" : "다시돌리기" }}
          </button>
        </div>
      </div>
    </div>
  </GameOnboarding>
</template>

<style scoped>
.wheel-page {
  position: relative;
}

.wheel-input-wide {
  width: 100%;
  max-width: 100%;
}

.wheel-items-hint {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.wheel-stage {
  margin-top: 1rem;
  padding: clamp(1.25rem, 4vw, 1.75rem) clamp(1rem, 3vw, 1.35rem) clamp(1.35rem, 4vw, 1.75rem);
  background: #faf6ef;
  border-radius: 1.15rem;
  border: 1px solid #e8e0d4;
  box-shadow: 0 10px 36px rgba(92, 74, 58, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  box-sizing: border-box;
}

.wheel-quote {
  margin: 0 0 0.35rem;
  min-height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 0.5rem;
}

.wheel-quote__inner {
  font-size: clamp(1.35rem, 5vw, 1.85rem);
  font-weight: 800;
  color: #1a1d24;
  letter-spacing: -0.02em;
  animation: wheelQuotePop 0.55s cubic-bezier(0.34, 1.45, 0.64, 1);
}

.wheel-quote--muted .wheel-quote__inner {
  font-size: clamp(0.95rem, 3.5vw, 1.1rem);
  font-weight: 600;
  color: #7a7268;
  animation: none;
}

@keyframes wheelQuotePop {
  0% {
    transform: scale(0.88);
    opacity: 0.65;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.wheel-frame {
  position: relative;
  width: min(300px, min(88vw, 100%));
  aspect-ratio: 1;
  margin-top: 0.35rem;
}

.wheel-pointer {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  transform-origin: 50% 0;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.18));
}

.wheel-pointer--spinning {
  animation: wheelPointerWag 0.26s ease-in-out infinite alternate;
}

.wheel-pointer__tri {
  width: 0;
  height: 0;
  border-left: 13px solid transparent;
  border-right: 13px solid transparent;
  border-top: 20px solid #e63946;
  transform-origin: 50% 0;
}

.wheel-pointer__tri--kick {
  animation: wheelPointerTick 0.09s ease-out;
}

@keyframes wheelPointerWag {
  from {
    transform: translateX(-50%) rotate(-6deg);
  }
  to {
    transform: translateX(-50%) rotate(6deg);
  }
}

@keyframes wheelPointerTick {
  0% {
    transform: translateY(0) scaleY(1);
  }
  45% {
    transform: translateY(4px) scaleY(0.85);
  }
  100% {
    transform: translateY(0) scaleY(1);
  }
}

.wheel-svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.wheel-rotor {
  transform-origin: 0 0;
  transition: none;
}

.wheel-svg__label {
  font-size: 11px;
  font-weight: 800;
  fill: #2d2a26;
  paint-order: stroke fill;
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 2.5px;
  stroke-linejoin: round;
  max-width: 72px;
}

@media (min-width: 380px) {
  .wheel-svg__label {
    font-size: 12px;
  }
}

.wheel-svg__hub {
  fill: #1a1d24;
  stroke: #faf6ef;
  stroke-width: 1.5;
}

.wheel-svg__rim {
  stroke: #5c4a3a;
  stroke-width: 2.25;
}

.wheel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
  margin-top: 1.15rem;
  width: 100%;
}

.wheel-btn {
  flex: 1 1 auto;
  min-width: min(100%, 200px);
  max-width: 280px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 1.15rem;
  border: none;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  background: #4a4038;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(74, 64, 56, 0.25);
  touch-action: manipulation;
}

.wheel-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

@media (hover: hover) and (pointer: fine) {
  .wheel-btn:not(:disabled):hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
}

</style>
