<script setup lang="ts">
import { computed } from "vue";
import { useGameOnboarding } from "../composables/useGameOnboarding";

const props = defineProps<{
  /** 접근성용 고유 id 접미사 (게임별로 다르게) */
  gameKey: string;
  introTitle: string;
  helpTitle: string;
  fabAriaLabel: string;
}>();

const slug = computed(() =>
  props.gameKey.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-")
);
const introTitleId = computed(() => `game-intro-title-${slug.value}`);
const helpTitleId = computed(() => `game-help-title-${slug.value}`);

const {
  introVisible,
  introBackdropFading,
  introAnimating,
  introCardRef,
  helpFabRef,
  helpOpen,
  confirmIntro,
} = useGameOnboarding();
</script>

<template>
  <div class="game-onboarding-page">
    <slot />
    <button
      ref="helpFabRef"
      type="button"
      class="game-help-fab"
      :class="{ 'game-help-fab--above-intro': introVisible }"
      :aria-label="fabAriaLabel"
      @click="helpOpen = true"
    >
      ?
    </button>

    <Teleport to="body">
      <div
        v-if="introVisible"
        class="game-intro-overlay"
        :class="{ 'game-intro-overlay--fade': introBackdropFading }"
        role="presentation"
        @click.self="!introAnimating && confirmIntro()"
      >
        <div
          ref="introCardRef"
          class="game-intro-card"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="introTitleId"
          @click.stop
        >
          <h2 :id="introTitleId" class="game-intro-card__title">{{ introTitle }}</h2>
          <div class="game-intro-card__body">
            <slot name="intro" />
          </div>
          <button
            type="button"
            class="btn btn--primary game-intro-card__ok"
            :disabled="introAnimating"
            @click="confirmIntro"
          >
            확인
          </button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="helpOpen"
        class="game-help-backdrop"
        :class="{ 'game-help-backdrop--above-intro': introVisible }"
        role="presentation"
        @click.self="helpOpen = false"
      >
        <div
          class="game-help-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="helpTitleId"
          @click.stop
        >
          <button type="button" class="game-help-modal__close" aria-label="닫기" @click="helpOpen = false">
            ×
          </button>
          <h2 :id="helpTitleId" class="game-help-modal__title">{{ helpTitle }}</h2>
          <slot name="help" />
          <p class="game-help-modal__foot">배경을 누르거나 ×, <kbd>Esc</kbd>로 닫을 수 있어요.</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
