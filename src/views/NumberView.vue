<script setup lang="ts">
import { ref } from "vue";
import GameOnboarding from "../components/GameOnboarding.vue";

const minV = ref(1);
const maxV = ref(100);
const result = ref<number | null>(null);
const resultTick = ref(0);

function draw() {
  const a = Math.min(minV.value, maxV.value);
  const b = Math.max(minV.value, maxV.value);
  result.value = Math.floor(Math.random() * (b - a + 1)) + a;
  resultTick.value += 1;
}
</script>

<template>
  <GameOnboarding
    game-key="number"
    intro-title="랜덤 숫자 뽑기 안내"
    help-title="랜덤 숫자 뽑기 설명서"
    fab-aria-label="랜덤 숫자 도움말 열기"
  >
    <template #intro>
      <p class="game-intro-lead">
        <strong>최소</strong>와 <strong>최대</strong>를 정한 뒤 <strong>뽑기</strong>를 누르면, 그 범위(양 끝 포함) 안의
        <strong>정수 하나</strong>가 무작위로 나옵니다.
      </p>
      <ul class="game-intro-list">
        <li>최소가 최대보다 커도 자동으로 바꿔서 계산해요.</li>
        <li>같은 범위로 여러 번 뽑을 수 있어요.</li>
        <li>오른쪽 아래 <strong>?</strong>에서 설명을 다시 볼 수 있어요.</li>
      </ul>
    </template>
    <template #help>
      <section class="game-help-section">
        <h3 class="game-help-section__h">동작</h3>
        <p class="game-help-section__p">
          입력한 두 숫자 중 작은 값부터 큰 값까지의 정수 전체를 후보로 두고, 그중 하나를 균등한 확률로 고릅니다.
          예를 들어 1과 6이면 1~6 중 하나가 나옵니다.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">팁</h3>
        <ul class="game-help-list game-help-list--unordered">
          <li>범위가 0이면(최소=최대) 그 숫자만 나옵니다.</li>
          <li>음수도 입력할 수 있습니다.</li>
        </ul>
      </section>
    </template>

    <div class="number-page">
      <header class="page__head">
        <RouterLink to="/" class="page__back">← 홈</RouterLink>
        <h1 class="page__title">랜덤 숫자 뽑기</h1>
        <p class="page__desc">최소·최대를 정하면 그 범위 안에서 정수 하나를 무작위로 뽑습니다.</p>
      </header>

      <div class="field row">
        <div>
          <label for="num-min">최소</label>
          <input id="num-min" v-model.number="minV" type="number" />
        </div>
        <div>
          <label for="num-max">최대</label>
          <input id="num-max" v-model.number="maxV" type="number" />
        </div>
      </div>
      <div class="btn-row">
        <button type="button" class="btn btn--primary" @click="draw">뽑기</button>
      </div>

      <div v-if="result !== null" class="panel number-result">
        <span class="number-result__label">결과</span>
        <span :key="resultTick" class="number-result__value">{{ result }}</span>
      </div>
    </div>
  </GameOnboarding>
</template>

<style scoped>
.number-page {
  position: relative;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.row > div {
  flex: 1 1 8rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

@media (max-width: 420px) {
  .row {
    flex-direction: column;
  }

  .row > div {
    flex: none;
    width: 100%;
  }
}

.number-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.number-result__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.number-result__value {
  font-family: "JetBrains Mono", monospace;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: var(--point);
  display: inline-block;
  animation: numberPop 0.5s cubic-bezier(0.34, 1.45, 0.64, 1);
}

@keyframes numberPop {
  0% {
    transform: scale(0.35) rotate(-6deg);
    opacity: 0.5;
    filter: blur(4px);
  }
  55% {
    transform: scale(1.08) rotate(2deg);
    opacity: 1;
    filter: blur(0);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
</style>
