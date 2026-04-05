<script setup lang="ts">
import { ref } from "vue";
import GameOnboarding from "../components/GameOnboarding.vue";

const side = ref<"heads" | "tails" | null>(null);
const flipping = ref(false);
const rotation = ref(0);

function flip() {
  if (flipping.value) return;
  const heads = Math.random() < 0.5;
  side.value = heads ? "heads" : "tails";
  flipping.value = true;
  const extra = heads ? 0 : 180;
  const target = rotation.value + 360 * 5 + extra - (rotation.value % 180);
  const start = rotation.value;
  const delta = target - start;
  const duration = 2200;
  const t0 = performance.now();

  function easeOut(t: number) {
    return 1 - (1 - t) ** 3;
  }

  function frame(now: number) {
    const t = Math.min(1, (now - t0) / duration);
    rotation.value = start + delta * easeOut(t);
    if (t < 1) requestAnimationFrame(frame);
    else {
      flipping.value = false;
      rotation.value = target;
    }
  }
  requestAnimationFrame(frame);
}
</script>

<template>
  <GameOnboarding
    game-key="coin"
    intro-title="동전 던지기 안내"
    help-title="동전 던지기 설명서"
    fab-aria-label="동전 던지기 도움말 열기"
  >
    <template #intro>
      <p class="game-intro-lead">
        <strong>동전 던지기</strong>를 누르면 동전이 돌아가며 <strong>앞면</strong> 또는 <strong>뒷면</strong> 중 하나가
        나옵니다. 각각 약 <strong>50%</strong>입니다.
      </p>
      <ul class="game-intro-list">
        <li>돌아가는 동안에는 연속으로 누를 수 없어요.</li>
        <li>오른쪽 아래 <strong>?</strong>에서 설명을 다시 열 수 있어요.</li>
      </ul>
    </template>
    <template #help>
      <section class="game-help-section">
        <h3 class="game-help-section__h">결과</h3>
        <p class="game-help-section__p">
          난수로 앞·뒤를 고릅니다. 화면의 동전은 3D로 회전하며, 멈춘 뒤 아래 문구로 결과를 확인할 수 있습니다.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">용도</h3>
        <p class="game-help-section__p">선공 정하기, 간단한 선택을 나눌 때 쓰기 좋습니다.</p>
      </section>
    </template>

    <div class="coin-page">
      <header class="page__head">
        <RouterLink to="/" class="page__back">← 홈</RouterLink>
        <h1 class="page__title">동전 던지기</h1>
        <p class="page__desc">앞면(앞)과 뒷면이 각각 50% 확률입니다.</p>
      </header>

      <div class="btn-row">
        <button type="button" class="btn btn--primary" :disabled="flipping" @click="flip">
          {{ flipping ? "던지는 중…" : "동전 던지기" }}
        </button>
      </div>

      <div class="panel coin-stage">
        <div class="coin-scene" :class="{ 'coin-scene--toss': flipping }">
          <div class="coin" :style="{ transform: `rotateY(${rotation}deg)` }">
            <div class="coin__face coin__face--front">앞</div>
            <div class="coin__face coin__face--back">뒤</div>
          </div>
        </div>
        <p v-if="side && !flipping" class="coin-label coin-label--land" :key="rotation">
          결과: <strong>{{ side === "heads" ? "앞면" : "뒷면" }}</strong>
        </p>
        <p v-else-if="!flipping && !side" class="coin-hint">버튼을 눌러 주세요.</p>
      </div>
    </div>
  </GameOnboarding>
</template>

<style scoped>
.coin-page {
  position: relative;
}

.coin-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.coin-scene {
  perspective: 800px;
  width: min(140px, 40vw);
  height: min(140px, 40vw);
  min-width: 112px;
  min-height: 112px;
  transform-origin: 50% 100%;
}

.coin-scene--toss {
  animation: coinToss 2.2s cubic-bezier(0.33, 0.9, 0.32, 1) forwards;
}

@keyframes coinToss {
  0% {
    transform: translateY(0) scale(1);
  }
  18% {
    transform: translateY(-42px) scale(1.06);
  }
  42% {
    transform: translateY(-8px) scale(0.98);
  }
  62% {
    transform: translateY(-22px) scale(1.03);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

.coin {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  border-radius: 50%;
}

.coin__face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.75rem;
  font-weight: 800;
  backface-visibility: hidden;
  border: 4px solid var(--border);
}

.coin__face--front {
  background: linear-gradient(145deg, #ffe8d6, #ff5c00);
  color: #fff;
  transform: rotateY(0deg);
}

.coin__face--back {
  background: linear-gradient(145deg, #e8ecff, #3d5cff);
  color: #fff;
  transform: rotateY(180deg);
}

.coin-label {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-muted);
}

.coin-label--land {
  animation: coinLabelIn 0.45s cubic-bezier(0.34, 1.35, 0.64, 1);
}

@keyframes coinLabelIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.coin-label strong {
  color: var(--point);
}

.coin-hint {
  margin: 0;
  color: var(--text-muted);
}
</style>
