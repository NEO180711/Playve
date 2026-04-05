import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LadderView from "../views/LadderView.vue";
import WheelView from "../views/WheelView.vue";
import PaperDrawView from "../views/PaperDrawView.vue";
import NumberView from "../views/NumberView.vue";
import CoinView from "../views/CoinView.vue";
import NamePickerView from "../views/NamePickerView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/ladder", name: "ladder", component: LadderView },
    { path: "/wheel", name: "wheel", component: WheelView },
    { path: "/paper", name: "paper", component: PaperDrawView },
    { path: "/number", name: "number", component: NumberView },
    { path: "/coin", name: "coin", component: CoinView },
    { path: "/names", name: "names", component: NamePickerView },
  ],
});

export default router;
