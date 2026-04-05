<script setup lang="ts">
import { ref, computed } from "vue";
import GameOnboarding from "../components/GameOnboarding.vue";

function parseCommaItems(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

const itemsInput = ref("");
const shuffled = ref<string[]>([]);
const revealed = ref<Record<number, string | null>>({});
const started = ref(false);

/** 바닥에 떨어질 때마다 카드마다 다른 랜덤 기울기·위치 */
type TossMeta = { rot: number; tx: number; ty: number; delay: number };
const tossMeta = ref<TossMeta[]>([]);

const flyingIndex = ref<number | null>(null);
const flyRect = ref({ top: 0, left: 0, width: 0, height: 0 });
/** 0: 오버레이 초기 위치, 1: 화면 앞으로 이동, 2: 펼침 */
const flyStep = ref(0);
let flyTimer1 = 0;
let flyTimer2 = 0;

function clearFlyTimers() {
  if (flyTimer1) window.clearTimeout(flyTimer1);
  if (flyTimer2) window.clearTimeout(flyTimer2);
  flyTimer1 = flyTimer2 = 0;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function startGame() {
  const list = parseCommaItems(itemsInput.value);
  if (list.length < 2) {
    alert("제비 내용을 쉼표로 구분해 2개 이상 입력해 주세요.");
    return;
  }
  clearFlyTimers();
  flyingIndex.value = null;
  flyStep.value = 0;
  shuffled.value = shuffle(list);
  revealed.value = {};
  tossMeta.value = list.map((_, idx) => ({
    rot: (Math.random() - 0.5) * 28,
    tx: (Math.random() - 0.5) * 32,
    ty: (Math.random() - 0.5) * 20,
    delay: idx * 48 + Math.random() * 80,
  }));
  started.value = true;
}

function resetGame() {
  clearFlyTimers();
  flyingIndex.value = null;
  flyStep.value = 0;
  started.value = false;
  shuffled.value = [];
  revealed.value = {};
  tossMeta.value = [];
}

function pick(ev: MouseEvent, i: number) {
  if (revealed.value[i] != null || flyingIndex.value !== null) return;
  const el = ev.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  flyRect.value = { top: r.top, left: r.left, width: r.width, height: r.height };
  flyingIndex.value = i;
  flyStep.value = 0;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyStep.value = 1;
    });
  });

  clearFlyTimers();
  flyTimer1 = window.setTimeout(() => {
    flyStep.value = 2;
  }, 1050);

  flyTimer2 = window.setTimeout(() => {
    revealed.value = { ...revealed.value, [i]: shuffled.value[i]! };
    flyingIndex.value = null;
    flyStep.value = 0;
  }, 2100);
}

const cards = computed(() => shuffled.value.map((_, i) => i));

const flyText = computed(() =>
  flyingIndex.value !== null ? shuffled.value[flyingIndex.value] ?? "" : ""
);
</script>

<template>
  <GameOnboarding
    game-key="paper"
    intro-title="제비뽑기 안내"
    help-title="제비뽑기 설명서"
    fab-aria-label="제비뽑기 도움말 열기"
  >
    <template #intro>
      <p class="game-intro-lead">
        제비 내용을 <strong>쉼표(,)</strong>로 구분해 적은 뒤 <strong>섞고 시작</strong>을 누르면 쪽지가 바닥에 떨어지듯
        깔립니다. <strong>쪽지 하나</strong>를 누르면 그 쪽지가 화면 쪽으로 날아와 <strong>펼쳐지며</strong> 내용이 보여요.
      </p>
      <ul class="game-intro-list">
        <li>시작 후에는 문구를 바꾸려면 <strong>다시 설정</strong>이 필요해요.</li>
        <li>이미 연 쪽지는 다시 뽑을 수 없어요.</li>
        <li>자세한 설명은 오른쪽 아래 <strong>?</strong>에서 볼 수 있어요.</li>
      </ul>
    </template>
    <template #help>
      <section class="game-help-section">
        <h3 class="game-help-section__h">진행 방법</h3>
        <ol class="game-help-list">
          <li>입력 칸에 가능한 결과(당첨, 꽝 등)를 <strong>쉼표(,)</strong>로 구분해 둡니다. 최소 2개 이상이어야 합니다.</li>
          <li>「섞고 시작」을 누르면 내용이 무작위로 섞이고, 쪽지가 바닥에 던져지듯 떨어집니다.</li>
          <li>쪽지를 누르면 그 조각이 화면 앞으로 날아와 펼쳐지며 결과가 나타납니다.</li>
        </ol>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">다시 설정</h3>
        <p class="game-help-section__p">
          문구를 고치거나 처음부터 다시 섞으려면 「다시 설정」으로 준비 화면으로 돌아간 뒤 진행하면 됩니다.
        </p>
      </section>
    </template>

    <div class="paper-page">
      <header class="page__head">
        <RouterLink to="/" class="page__back">← 홈</RouterLink>
        <h1 class="page__title">제비뽑기</h1>
        <p class="page__desc">
          제비는 <strong>쉼표로 구분</strong>합니다. 섞은 뒤 바닥에 떨어진 쪽지를 골라, 날아오며 펼쳐지는 결과를
          확인하세요.
        </p>
      </header>

      <div class="field">
        <label for="paper-items">제비 내용 (쉼표로 구분)</label>
        <input
          id="paper-items"
          v-model="itemsInput"
          type="text"
          class="paper-input-wide"
          :disabled="started"
          placeholder="예: 당첨, 꽝, 꽝, 꽝"
        />
      </div>
      <div class="btn-row">
        <button v-if="!started" type="button" class="btn btn--primary" @click="startGame">섞고 시작</button>
        <button v-else type="button" class="btn btn--secondary" :disabled="flyingIndex !== null" @click="resetGame">
          다시 설정
        </button>
      </div>

      <div v-if="started" class="paper-floor panel">
        <p class="paper-floor__label" aria-hidden="true">바닥에 떨어진 쪽지</p>
        <div class="paper-scatter">
          <button
            v-for="i in cards"
            :key="i"
            type="button"
            class="paper-note"
            :class="{
              'paper-note--open': revealed[i] != null,
              'paper-note--hidden': flyingIndex === i,
            }"
            :disabled="flyingIndex !== null"
            :style="{
              '--toss-rot': `${tossMeta[i]?.rot ?? 0}deg`,
              '--toss-tx': `${tossMeta[i]?.tx ?? 0}px`,
              '--toss-ty': `${tossMeta[i]?.ty ?? 0}px`,
              '--toss-delay': `${tossMeta[i]?.delay ?? 0}ms`,
            }"
            @click="pick($event, i)"
          >
            <span class="paper-note__inner">
              <span class="paper-note__face paper-note__face--front">
                <span class="paper-note__fold" aria-hidden="true" />
                <span class="paper-note__q">?</span>
              </span>
              <span class="paper-note__face paper-note__face--back">
                <span class="paper-note__text">{{ revealed[i] ?? "" }}</span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="flyingIndex !== null" class="paper-fly-root">
        <div
          class="paper-fly-backdrop"
          :class="{ 'paper-fly-backdrop--dim': flyStep >= 1 }"
          aria-hidden="true"
        />
        <div
          class="paper-fly-layer"
          :class="{
            'paper-fly-layer--step1': flyStep >= 1,
            'paper-fly-layer--step2': flyStep >= 2,
          }"
          :style="{
            top: flyRect.top + 'px',
            left: flyRect.left + 'px',
            width: flyRect.width + 'px',
            height: flyRect.height + 'px',
          }"
        >
          <div class="paper-fly-note">
            <div class="paper-fly-note__folded">
              <span class="paper-fly-note__q">?</span>
            </div>
            <div class="paper-fly-note__open" :class="{ 'paper-fly-note__open--show': flyStep >= 2 }">
              <p class="paper-fly-note__result">{{ flyText }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </GameOnboarding>
</template>

<style scoped>
.paper-page {
  position: relative;
}

.paper-input-wide {
  width: 100%;
  max-width: 100%;
}

.paper-floor {
  margin-top: 1.25rem;
  padding: 1rem 1.1rem 1.35rem;
  background: linear-gradient(180deg, #e8dfd4 0%, #d4c9bc 48%, #c9bdb0 100%);
  border: 1px solid #bfb3a5;
  border-radius: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 8px 28px rgba(62, 52, 42, 0.12);
  perspective: 1100px;
  perspective-origin: 50% 35%;
}

.paper-floor__label {
  margin: 0 0 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(58, 48, 40, 0.55);
}

.paper-scatter {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 5.25rem), 1fr));
  gap: 0.85rem;
  transform-style: preserve-3d;
}

.paper-note {
  position: relative;
  min-height: 104px;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  cursor: pointer;
  transform-style: preserve-3d;
  -webkit-tap-highlight-color: transparent;
  animation: paperTossLand 0.95s cubic-bezier(0.22, 0.82, 0.22, 1) both;
  animation-delay: var(--toss-delay, 0ms);
}

.paper-note:disabled {
  cursor: default;
}

.paper-note--hidden {
  opacity: 0;
  pointer-events: none;
}

.paper-note__inner {
  position: relative;
  display: block;
  width: 100%;
  min-height: 104px;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.35rem 0.85rem 0.85rem 0.35rem;
  box-shadow:
    0 3px 0 rgba(62, 52, 42, 0.12),
    0 10px 22px rgba(42, 36, 30, 0.18);
}

.paper-note--open .paper-note__inner {
  transform: rotateY(180deg);
}

.paper-note__face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.35rem 0.85rem 0.85rem 0.35rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border: 1px solid rgba(62, 52, 42, 0.14);
}

.paper-note__face--front {
  background: linear-gradient(145deg, #fffef9 0%, #f5f0e6 55%, #ebe4d8 100%);
}

.paper-note__face--back {
  background: linear-gradient(145deg, #fff8ee 0%, #f2e8dc 100%);
  transform: rotateY(180deg);
  border-color: var(--point);
  box-shadow: inset 0 0 0 1px rgba(255, 92, 0, 0.15);
}

.paper-note__fold {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.15rem;
  height: 1.15rem;
  background: linear-gradient(135deg, transparent 50%, rgba(200, 190, 175, 0.55) 50%);
  border-radius: 0 0.75rem 0 0;
  pointer-events: none;
}

.paper-note__q {
  font-size: 1.65rem;
  font-weight: 800;
  color: #8a8075;
}

.paper-note__text {
  font-size: 0.92rem;
  font-weight: 700;
  padding: 0.5rem;
  text-align: center;
  word-break: keep-all;
  color: var(--text);
}

@keyframes paperTossLand {
  0% {
    opacity: 0;
    transform: translate3d(calc(var(--toss-tx, 0px) * 2.5), -140%, 180px) rotateX(52deg) rotateZ(calc(var(--toss-rot, 0deg) * 1.8))
      scale(0.88);
  }
  55% {
    opacity: 1;
  }
  78% {
    transform: translate3d(var(--toss-tx, 0px), var(--toss-ty, 0px), 0) rotateX(4deg) rotateZ(var(--toss-rot, 0deg))
      scale(1.03);
  }
  100% {
    transform: translate3d(var(--toss-tx, 0px), var(--toss-ty, 0px), 0) rotateX(0deg) rotateZ(var(--toss-rot, 0deg)) scale(1);
  }
}

@media (hover: hover) and (pointer: fine) {
  .paper-note:hover:not(:disabled):not(.paper-note--open):not(.paper-note--hidden) .paper-note__inner {
    transform: translateY(-3px) translateZ(6px);
    box-shadow:
      0 5px 0 rgba(62, 52, 42, 0.1),
      0 14px 28px rgba(42, 36, 30, 0.22);
  }
}

</style>

<style>
/* Teleport → body: 전역 한 장 레이어 (scoped 비적용) */
.paper-fly-root {
  position: fixed;
  inset: 0;
  z-index: 280;
  pointer-events: none;
}

.paper-fly-root .paper-fly-backdrop {
  pointer-events: none;
}

.paper-fly-backdrop {
  position: absolute;
  inset: 0;
  background: transparent;
  transition: background 0.45s ease;
}

.paper-fly-backdrop--dim {
  background: rgba(26, 29, 36, 0.35);
  pointer-events: auto;
}

.paper-fly-layer {
  position: absolute;
  transform-origin: center center;
  transform-style: preserve-3d;
  pointer-events: none;
  transition:
    top 1.05s cubic-bezier(0.25, 0.82, 0.2, 1),
    left 1.05s cubic-bezier(0.25, 0.82, 0.2, 1),
    width 1.05s cubic-bezier(0.25, 0.82, 0.2, 1),
    height 1.05s cubic-bezier(0.25, 0.82, 0.2, 1),
    transform 1.05s cubic-bezier(0.25, 0.82, 0.2, 1);
}

.paper-fly-layer--step1 {
  top: 50% !important;
  left: 50% !important;
  width: min(16rem, 86vw) !important;
  height: min(11rem, 42vh) !important;
  transform: translate(-50%, -50%) translateZ(120px) scale(1);
}

.paper-fly-layer--step2 {
  width: min(18.5rem, 90vw) !important;
  height: min(13rem, 48vh) !important;
  transform: translate(-50%, -52%) translateZ(200px) scale(1.06);
}

.paper-fly-note {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 900px;
}

.paper-fly-note__folded,
.paper-fly-note__open {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem 1rem 1rem 0.4rem;
  border: 2px solid rgba(62, 52, 42, 0.12);
  box-shadow: 0 16px 40px rgba(42, 36, 30, 0.28);
}

.paper-fly-note__folded {
  background: linear-gradient(160deg, #fffef9 0%, #efe8dc 100%);
  transition:
    opacity 0.45s ease,
    transform 0.75s cubic-bezier(0.34, 1.15, 0.52, 1);
  transform: rotateX(12deg) scale(0.98);
}

.paper-fly-layer--step2 .paper-fly-note__folded {
  opacity: 0;
  transform: rotateX(78deg) scale(0.4);
  pointer-events: none;
}

.paper-fly-note__q {
  font-size: clamp(2rem, 8vw, 2.75rem);
  font-weight: 800;
  color: #8a8075;
}

.paper-fly-note__open {
  background: linear-gradient(165deg, #fffaf3 0%, #f5ebe0 45%, #ebe0d4 100%);
  opacity: 0;
  transform: rotateX(88deg) scaleY(0.25);
  transform-origin: center top;
  transition:
    opacity 0.5s ease 0.12s,
    transform 0.85s cubic-bezier(0.28, 1.18, 0.45, 1) 0.08s;
  border-color: rgba(255, 92, 0, 0.35);
}

.paper-fly-note__open--show {
  opacity: 1;
  transform: rotateX(0deg) scaleY(1);
}

.paper-fly-note__result {
  margin: 0;
  padding: 1rem 1.15rem;
  font-size: clamp(1.15rem, 4.2vw, 1.45rem);
  font-weight: 800;
  text-align: center;
  line-height: 1.45;
  word-break: keep-all;
  color: #1a1d24;
}
</style>
