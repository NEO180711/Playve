<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const path = computed(() => route.path);

const nav = [
  { to: "/", label: "홈" },
  { to: "/ladder", label: "사다리" },
  { to: "/wheel", label: "룰렛" },
  { to: "/paper", label: "제비" },
  { to: "/number", label: "숫자" },
  { to: "/coin", label: "동전" },
  { to: "/names", label: "이름 뽑기" },
];
</script>

<template>
  <div class="layout">
    <header class="layout__header">
      <RouterLink to="/" class="layout__brand">
        <span class="layout__logo">P</span>
        <span>Playve</span>
      </RouterLink>
      <nav class="layout__nav" aria-label="게임 메뉴">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="layout__link"
          :class="{ 'layout__link--active': path === item.to }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>
    <main class="layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.75rem max(1.25rem, env(safe-area-inset-right)) 0.75rem max(1.25rem, env(safe-area-inset-left));
  padding-top: max(0.75rem, env(safe-area-inset-top));
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
}

.layout__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text);
}

.layout__brand:hover {
  color: var(--point);
}

.layout__logo {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: var(--point);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 1rem;
}

.layout__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  align-items: center;
  max-width: 100%;
}

.layout__link {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  border: 1px solid transparent;
}

.layout__link:hover {
  color: var(--secondary);
  background: var(--card);
}

.layout__link--active {
  color: #fff;
  background: var(--secondary);
}

.layout__link--active:hover {
  color: #fff;
  background: var(--point);
}

.layout__main {
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.5rem) clamp(0.75rem, 4vw, 1.25rem)
    max(3rem, env(safe-area-inset-bottom));
  padding-left: max(clamp(0.75rem, 4vw, 1.25rem), env(safe-area-inset-left));
  padding-right: max(clamp(0.75rem, 4vw, 1.25rem), env(safe-area-inset-right));
}

@media (max-width: 768px) {
  .layout__header {
    flex-direction: column;
    align-items: stretch;
  }

  .layout__nav {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    padding-bottom: 0.35rem;
    margin-inline: -0.15rem;
    padding-inline: 0.15rem;
  }

  .layout__link {
    flex-shrink: 0;
    min-height: 2.5rem;
    display: inline-flex;
    align-items: center;
  }
}
</style>
