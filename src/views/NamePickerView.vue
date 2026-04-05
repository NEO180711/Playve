<script setup lang="ts">
import { ref, computed } from "vue";
import GameOnboarding from "../components/GameOnboarding.vue";

function parseCommaNames(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

const namesInput = ref("");
const highlight = ref<string | null>(null);
const picking = ref(false);

const nameLines = computed(() => parseCommaNames(namesInput.value));

function pick() {
  const names = parseCommaNames(namesInput.value);
  if (names.length < 2) {
    alert("이름을 쉼표로 구분해 2명 이상 입력해 주세요.");
    return;
  }
  picking.value = true;
  highlight.value = null;
  let step = 0;
  const maxSteps = 28;
  const interval = setInterval(() => {
    highlight.value = names[Math.floor(Math.random() * names.length)]!;
    step++;
    if (step >= maxSteps) {
      clearInterval(interval);
      highlight.value = names[Math.floor(Math.random() * names.length)]!;
      picking.value = false;
    }
  }, 80);
}
</script>

<template>
  <GameOnboarding
    game-key="namepicker"
    intro-title="랜덤 이름 추첨 안내"
    help-title="랜덤 이름 추첨 설명서"
    fab-aria-label="이름 추첨 도움말 열기"
  >
    <template #intro>
      <p class="game-intro-lead">
        이름을 <strong>쉼표(,)</strong>로 구분해 한 줄에 적고 <strong>뽑기</strong>를 누르면, 잠시 돌다가
        <strong>한 명</strong>이 강조됩니다. 최소 <strong>2명</strong>이 필요해요.
      </p>
      <ul class="game-intro-list">
        <li>추첨 중에는 명단을 수정할 수 없어요.</li>
        <li>오른쪽 아래 <strong>?</strong>에서 설명을 다시 볼 수 있어요.</li>
      </ul>
    </template>
    <template #help>
      <section class="game-help-section">
        <h3 class="game-help-section__h">진행</h3>
        <p class="game-help-section__p">
          쉼표로 나눈 뒤 앞뒤 공백은 자동으로 정리하고, 빈 칸은 빼고 이름만 모읍니다. 「뽑기」를 누르면 여러 번
          깜빡이다가 최종으로 한 명이 선택됩니다. 같은 이름을 두 번 적으면 후보가 두 번 들어갑니다.
        </p>
      </section>
      <section class="game-help-section">
        <h3 class="game-help-section__h">다시 뽑기</h3>
        <p class="game-help-section__p">「뽑기」를 다시 누르면 새로 무작위로 고릅니다.</p>
      </section>
    </template>

    <div class="name-picker-page">
      <header class="page__head">
        <RouterLink to="/" class="page__back">← 홈</RouterLink>
        <h1 class="page__title">랜덤 이름 추첨</h1>
        <p class="page__desc">이름을 쉼표로 구분해 넣고 뽑기를 누르면 한 명이 강조됩니다.</p>
      </header>

      <div class="field">
        <label for="names-list">이름 (쉼표로 구분)</label>
        <input
          id="names-list"
          v-model="namesInput"
          type="text"
          class="name-picker-input-wide"
          placeholder="예: 선아,지영,현우,서연"
          :disabled="picking"
        />
      </div>
      <div class="btn-row">
        <button type="button" class="btn btn--primary" :disabled="picking" @click="pick">
          {{ picking ? "추첨 중…" : "뽑기" }}
        </button>
      </div>

      <div class="name-cloud panel">
        <span
          v-for="(n, i) in nameLines"
          :key="i"
          class="name-tag"
          :class="{
            'name-tag--dim': picking || (highlight && highlight !== n),
            'name-tag--winner': highlight === n && !picking,
            'name-tag--flash': picking && highlight === n,
          }"
          :style="{ '--tag-i': i }"
        >
          {{ n }}
        </span>
      </div>
    </div>
  </GameOnboarding>
</template>

<style scoped>
.name-picker-page {
  position: relative;
}

.name-picker-input-wide {
  width: 100%;
  max-width: 100%;
}

.name-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  min-height: 120px;
  align-items: center;
}

.name-tag {
  display: inline-block;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: var(--card);
  border: 1px solid var(--border);
  font-size: 0.95rem;
  font-weight: 600;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  animation: nameTagEnter 0.48s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--tag-i, 0) * 42ms);
}

@keyframes nameTagEnter {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.88);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.name-tag--dim {
  opacity: 0.35;
  transform: scale(0.92);
}

.name-tag--flash {
  border-color: var(--secondary);
  color: var(--secondary);
  transform: scale(1.05);
}

.name-tag--winner {
  font-size: clamp(1.05rem, 4.5vw, 1.35rem);
  padding: clamp(0.5rem, 2vw, 0.65rem) clamp(0.85rem, 3vw, 1.25rem);
  background: linear-gradient(120deg, rgba(255, 92, 0, 0.2), rgba(61, 92, 255, 0.18));
  border: 2px solid var(--point);
  color: var(--text);
  box-shadow:
    0 0 0 4px rgba(255, 92, 0, 0.15),
    var(--shadow-orange);
  transform: scale(1.1);
  animation: nameTagWinPop 0.55s cubic-bezier(0.34, 1.45, 0.64, 1);
  max-width: 100%;
  text-align: center;
  word-break: keep-all;
}

@keyframes nameTagWinPop {
  0% {
    transform: scale(0.82);
  }
  60% {
    transform: scale(1.16);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
