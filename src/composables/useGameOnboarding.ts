import { ref, watch, onUnmounted, nextTick } from "vue";

/** 게임 화면에 들어올 때마다 안내를 다시 띄웁니다(브라우저에 닫음 상태를 저장하지 않음). */
export function useGameOnboarding() {
  const introVisible = ref(true);
  const introBackdropFading = ref(false);
  const introAnimating = ref(false);
  const introCardRef = ref<HTMLElement | null>(null);
  const helpFabRef = ref<HTMLElement | null>(null);
  const helpOpen = ref(false);

  function onHelpEscape(e: KeyboardEvent) {
    if (e.key === "Escape") helpOpen.value = false;
  }

  function onIntroEscape(e: KeyboardEvent) {
    if (e.key !== "Escape" || !introVisible.value) return;
    if (helpOpen.value) return;
    e.preventDefault();
    finishIntro();
  }

  watch(
    introVisible,
    (v) => {
      if (typeof document === "undefined") return;
      document.body.style.overflow = v ? "hidden" : "";
      if (v) window.addEventListener("keydown", onIntroEscape);
      else window.removeEventListener("keydown", onIntroEscape);
    },
    { immediate: true }
  );

  watch(helpOpen, (open) => {
    if (open) window.addEventListener("keydown", onHelpEscape);
    else window.removeEventListener("keydown", onHelpEscape);
  });

  function finishIntro() {
    introVisible.value = false;
    introBackdropFading.value = false;
    introAnimating.value = false;
    const el = introCardRef.value;
    if (el) {
      el.style.transition = "";
      el.style.transform = "";
      el.style.opacity = "";
      el.style.transformOrigin = "";
    }
  }

  function confirmIntro() {
    if (introAnimating.value) return;
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const card = introCardRef.value;
          const fab = helpFabRef.value;
          if (!card || !fab || fab.getBoundingClientRect().width < 1) {
            finishIntro();
            return;
          }
          introAnimating.value = true;
          let finished = false;
          const safeFinish = () => {
            if (finished) return;
            finished = true;
            finishIntro();
          };
          try {
            const cr = card.getBoundingClientRect();
            const fr = fab.getBoundingClientRect();
            const cx = cr.left + cr.width / 2;
            const cy = cr.top + cr.height / 2;
            const fx = fr.left + fr.width / 2;
            const fy = fr.top + fr.height / 2;
            const dx = fx - cx;
            const dy = fy - cy;
            const scale = Math.max(0.07, (fr.width / cr.width) * 0.92);

            card.style.transformOrigin = "center center";
            card.style.transition =
              "transform 0.78s cubic-bezier(0.55, 0.02, 0.85, 0.25), opacity 0.72s ease-out";
            requestAnimationFrame(() => {
              card.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
              card.style.opacity = "0";
            });

            introBackdropFading.value = true;
            window.setTimeout(safeFinish, 820);
          } catch {
            safeFinish();
          }
        });
      });
    });
  }

  onUnmounted(() => {
    window.removeEventListener("keydown", onHelpEscape);
    window.removeEventListener("keydown", onIntroEscape);
    if (typeof document !== "undefined") document.body.style.overflow = "";
  });

  return {
    introVisible,
    introBackdropFading,
    introAnimating,
    introCardRef,
    helpFabRef,
    helpOpen,
    confirmIntro,
  };
}
