<script setup lang="ts">
import { ref, onMounted } from "vue";
import { readAdConsent, writeAdConsent, type AdConsent } from "../lib/consent";

const emit = defineEmits<{
  (e: "consent", v: AdConsent): void;
}>();

const visible = ref(false);

onMounted(() => {
  visible.value = readAdConsent() === null;
});

function choose(v: AdConsent) {
  writeAdConsent(v);
  visible.value = false;
  emit("consent", v);
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="consent" role="dialog" aria-labelledby="consent-title" aria-live="polite">
      <div class="consent__card">
        <p id="consent-title" class="consent__title">쿠키 · 맞춤 광고 안내</p>
        <p class="consent__text">
          Playve는 서비스 운영과 <strong>맞춤·비맞춤 광고</strong>에 쿠키 및 유사 기술을 사용할 수 있습니다. 동의하면
          맞춤 광고가 표시될 수 있고, 거부해도 사이트 이용은 가능합니다.
          <RouterLink to="/privacy">개인정보처리방침</RouterLink>·
          <RouterLink to="/terms">이용약관</RouterLink>을 참고하세요.
        </p>
        <div class="consent__actions">
          <button type="button" class="btn btn--secondary consent__btn" @click="choose('denied')">거부</button>
          <button type="button" class="btn btn--primary consent__btn" @click="choose('granted')">동의</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.consent {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: max(1rem, env(safe-area-inset-bottom)) 1rem 1rem;
  background: rgba(15, 18, 28, 0.38);
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.consent__card {
  width: 100%;
  max-width: 36rem;
  padding: 1.1rem 1.2rem 1.15rem;
  background: #fff;
  border-radius: 1rem;
  border: 1px solid var(--border);
  box-shadow: 0 -4px 28px rgba(0, 0, 0, 0.12);
}

.consent__title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
}

.consent__text {
  margin: 0 0 1rem;
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.consent__text :deep(a) {
  color: var(--secondary);
  font-weight: 700;
}

.consent__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.consent__btn {
  min-height: 2.5rem;
  padding-inline: 1rem;
}
</style>
