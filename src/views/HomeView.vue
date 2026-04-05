<script setup lang="ts">
const games = [
  {
    to: "/ladder",
    title: "사다리타기",
    desc: "참가자는 쉼표로, 도착은 옵션으로. 복사로 같은 꽝·당첨을 빠르게 채울 수 있어요.",
  },
  {
    to: "/wheel",
    title: "원판 돌리기",
    desc: "항목을 넣고 돌리면 화살표가 가리키는 곳이 당첨.",
  },
  {
    to: "/paper",
    title: "제비뽑기",
    desc: "쉼표로 항목을 넣고, 바닥의 쪽지 하나를 골라 결과를 확인합니다.",
  },
  {
    to: "/number",
    title: "랜덤 숫자",
    desc: "범위를 정해 1~100 등 무작위 숫자를 뽑습니다.",
  },
  {
    to: "/coin",
    title: "동전 던지기",
    desc: "앞면·뒷면 50:50 확률.",
  },
  {
    to: "/names",
    title: "랜덤 이름 추첨",
    desc: "이름을 쉼표로 넣고, 한 명을 화려하게 강조해 뽑아줍니다.",
  },
];
</script>

<template>
  <div class="home">
    <section class="home__hero">
      <p class="home__eyebrow">미니게임 모음</p>
      <h1 class="home__title">
        친구들과 바로 즐기는 <span class="home__accent">Playve</span>
      </h1>
      <p class="home__lead">
        순백 배경에 오렌지와 로열 블루 포인트. 내기·추첨·운 맡기기까지 한 곳에서.
      </p>
    </section>
    <ul class="home__grid">
      <li v-for="g in games" :key="g.to">
        <RouterLink :to="g.to" class="home__card">
          <h2 class="home__card-title">{{ g.title }}</h2>
          <p class="home__card-desc">{{ g.desc }}</p>
          <span class="home__card-cta">시작하기 →</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home__hero {
  margin-bottom: 2rem;
}

.home__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--point);
}

.home__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.home__accent {
  color: var(--secondary);
}

.home__lead {
  margin: 0;
  max-width: 36rem;
  color: var(--text-muted);
  font-size: clamp(0.95rem, 2.8vw, 1.05rem);
}

.home__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: clamp(0.75rem, 2vw, 1rem);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr));
}

.home__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(1rem, 3vw, 1.25rem) clamp(1.05rem, 3vw, 1.35rem);
  background: var(--card);
  border-radius: 1rem;
  border: 1px solid var(--border);
  color: inherit;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .home__card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow);
    border-color: rgba(61, 92, 255, 0.25);
  }

  .home__card:hover .home__card-cta {
    color: var(--secondary);
  }
}

@media (hover: none) {
  .home__card:active {
    transform: scale(0.99);
    border-color: rgba(61, 92, 255, 0.35);
  }
}

.home__card-title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  color: var(--text);
}

.home__card-desc {
  margin: 0 0 1rem;
  flex: 1;
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.45;
}

.home__card-cta {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--point);
}

</style>
