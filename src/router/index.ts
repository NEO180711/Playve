import { createRouter, createWebHistory } from "vue-router";
import type { RouterScrollBehavior } from "vue-router";

const scrollBehavior: RouterScrollBehavior = (to, _from, saved) => {
  if (saved) return saved;
  if (to.hash) return { el: to.hash, behavior: "smooth" };
  return { top: 0, left: 0 };
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        title: "Playve — 미니게임 모음 · 사다리·룰렛·추첨",
        description:
          "Playve — 사다리타기, 원판(룰렛), 제비뽑기, 랜덤 숫자·동전, 이름 추첨까지. 친구들과 바로 즐기는 무료 미니게임 모음.",
      },
    },
    {
      path: "/ladder",
      name: "ladder",
      component: () => import("../views/LadderView.vue"),
      meta: {
        title: "사다리타기",
        description: "참가자와 도착 옵션을 정해 무작위 사다리를 그리고, 연출과 함께 결과를 확인합니다.",
      },
    },
    {
      path: "/wheel",
      name: "wheel",
      component: () => import("../views/WheelView.vue"),
      meta: {
        title: "원판 돌리기(룰렛)",
        description: "항목을 넣고 원판을 돌려 화살표가 가리키는 당첨 항목을 뽑습니다.",
      },
    },
    {
      path: "/paper",
      name: "paper",
      component: () => import("../views/PaperDrawView.vue"),
      meta: {
        title: "제비뽑기",
        description: "쉼표로 항목을 넣고 쪽지를 섞은 뒤, 한 장씩 뒤집어 결과를 확인합니다.",
      },
    },
    {
      path: "/number",
      name: "number",
      component: () => import("../views/NumberView.vue"),
      meta: {
        title: "랜덤 숫자 뽑기",
        description: "최소·최대 범위 안에서 무작위 정수 하나를 뽑습니다.",
      },
    },
    {
      path: "/coin",
      name: "coin",
      component: () => import("../views/CoinView.vue"),
      meta: {
        title: "동전 던지기",
        description: "앞면·뒷면을 50:50 확률로 무작위 결정합니다.",
      },
    },
    {
      path: "/names",
      name: "names",
      component: () => import("../views/NamePickerView.vue"),
      meta: {
        title: "랜덤 이름 추첨",
        description: "쉼표로 구분한 이름 중 한 명을 무작위로 강조해 뽑습니다.",
      },
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("../views/PrivacyView.vue"),
      meta: {
        title: "개인정보처리방침",
        description: "Playve 개인정보처리방침 — 광고·쿠키·제3자 서비스 안내.",
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "사이트 소개",
        description:
          "Playve 목적, 독창적 콘텐츠·개인정보 처리 원칙, 고품질 사이트 운영 지향을 설명합니다.",
      },
    },
    {
      path: "/faq",
      name: "faq",
      component: () => import("../views/FaqView.vue"),
      meta: {
        title: "자주 묻는 질문",
        description: "Playve 무료 이용, 데이터 저장, 모바일, 무작위 결과, 광고에 대한 FAQ.",
      },
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/TermsView.vue"),
      meta: {
        title: "이용약관",
        description: "Playve 서비스 이용 조건, 면책, 지적 재산, 약관 변경에 관한 안내.",
      },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
      meta: {
        title: "문의하기",
        description: "Playve 운영자 문의·피드백 공식 연락처 안내.",
      },
    },
  ],
});

export default router;
