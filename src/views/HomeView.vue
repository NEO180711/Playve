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

    <section class="home__about" aria-labelledby="home-about-h">
      <h2 id="home-about-h" class="home__about-title">Playve는 어떤 서비스인가요?</h2>
      <p class="home__about-text">
        <strong>Playve</strong>는 친구·동아리·수업 등에서 바로 쓸 수 있는 <strong>무료 미니게임·추첨 도구</strong>입니다.
        사다리타기로 역할을 나누고, 원판(룰렛)으로 당첨 항목을 정하고, 제비뽑기·랜덤 숫자·동전 던지기·이름 추첨으로
        공정하게 결과를 정할 수 있습니다. 별도 앱 설치 없이 휴대폰·PC 브라우저에서 동작하며, 개인정보를 서버에 올리지
        않는 방식으로 게임을 즐기도록 설계했습니다. 사이트 운영을 위해 제3자 광고가 표시될 수 있으며, 자세한 내용은
        <RouterLink to="/privacy">개인정보처리방침</RouterLink>에서 확인할 수 있습니다.
      </p>
    </section>

    <section class="home__quality" aria-labelledby="home-quality-h">
      <h2 id="home-quality-h" class="home__quality-title">사용자를 위한 운영 원칙</h2>
      <p class="home__quality-lead">
        유용한 설명·명확한 구조·투명한 운영을 지향합니다. 아래는 그에 맞춘 실천 사항입니다.
      </p>
      <ul class="home__quality-list">
        <li><strong>유용한 설명</strong> — 각 게임마다 도움말(?)과 안내 문구로 이용 방법을 분명히 적습니다.</li>
        <li><strong>명확한 구조</strong> — 홈, 게임별 페이지, 소개·FAQ·약관·개인정보·문의로 내비게이션을 나눕니다.</li>
        <li><strong>투명성</strong> —
          <RouterLink to="/about">사이트 소개</RouterLink>,
          <RouterLink to="/contact">문의</RouterLink>,
          <RouterLink to="/terms">이용약관</RouterLink>에서 운영 목적과 연락 경로를 안내합니다.</li>
        <li><strong>정책 준수</strong> — 광고·쿠키는 동의 안내와 개인정보처리방침에 따라 처리합니다.</li>
      </ul>
    </section>
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

.home__about {
  margin-top: clamp(2rem, 5vw, 2.75rem);
  padding: clamp(1.1rem, 3vw, 1.35rem) clamp(1rem, 3vw, 1.25rem);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.home__about-title {
  margin: 0 0 0.65rem;
  font-size: clamp(1rem, 2.8vw, 1.15rem);
  font-weight: 700;
  color: var(--text);
}

.home__about-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.home__about-text :deep(a) {
  color: var(--secondary);
  font-weight: 600;
}

.home__quality {
  margin-top: clamp(1.5rem, 4vw, 2rem);
  padding: clamp(1.1rem, 3vw, 1.35rem) clamp(1rem, 3vw, 1.25rem);
  background: linear-gradient(135deg, rgba(61, 92, 255, 0.06) 0%, rgba(255, 92, 0, 0.05) 100%);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.home__quality-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1rem, 2.8vw, 1.12rem);
  font-weight: 700;
  color: var(--text);
}

.home__quality-lead {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.home__quality-lead a {
  color: var(--secondary);
  font-weight: 700;
}

.home__quality-list {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.home__quality-list li {
  margin-bottom: 0.45rem;
}

.home__quality-list :deep(a) {
  color: var(--secondary);
  font-weight: 600;
}

</style>
