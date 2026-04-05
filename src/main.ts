import { createApp } from "vue";
import type { RouteLocationNormalized } from "vue-router";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/game-onboarding.css";

const defaultTitle = "Playve — 미니게임 모음 · 사다리·룰렛·추첨";
const defaultDescription =
  "Playve — 사다리타기, 원판(룰렛), 제비뽑기, 랜덤 숫자·동전, 이름 추첨까지. 친구들과 바로 즐기는 무료 미니게임 모음.";

router.afterEach((to: RouteLocationNormalized) => {
  const t = to.meta.title as string | undefined;
  document.title = t ? (to.path === "/" ? t : `${t} | Playve`) : defaultTitle;
  const desc = (to.meta.description as string) || defaultDescription;
  const el = document.getElementById("meta-desc");
  if (el) el.setAttribute("content", desc);
});

createApp(App).use(router).mount("#app");
