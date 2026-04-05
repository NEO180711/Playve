<script setup lang="ts">
import { computed } from "vue";

const contactEmail = computed(() => import.meta.env.VITE_CONTACT_EMAIL?.trim() || "");
</script>

<template>
  <article class="contact-page">
    <header class="page__head">
      <RouterLink to="/" class="page__back">← 홈</RouterLink>
      <h1 class="page__title">문의하기</h1>
      <p class="page__desc">운영자에게 연락할 수 있는 공식 경로를 안내합니다.</p>
    </header>

    <div class="legal-body panel">
      <p>
        사이트 오류, 개인정보·광고 관련 질문, 콘텐츠 정정 요청 등은 아래 경로로 연락해 주세요.
        <strong>투명한 연락처</strong>를 제공합니다.
      </p>

      <h2>이메일</h2>
      <p v-if="contactEmail">
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
      </p>
      <p v-else>
        배포 시 환경 변수 <code>VITE_CONTACT_EMAIL</code>에 운영용 이메일을 넣으면 이 페이지에 표시됩니다.
        (예: <code>.env</code> 파일에 <code>VITE_CONTACT_EMAIL=hello@example.com</code>)
      </p>

      <h2>처리 안내</h2>
      <p>
        문의량에 따라 답변이 늦어질 수 있습니다. 스팸·광고성 메일은 차단될 수 있습니다. 긴급한 법적 통지는 이메일 제목에
        “[법적 통지]”를 명시해 주시면 검토에 도움이 됩니다.
      </p>

      <p>
        개인정보·쿠키·광고에 관한 내용은
        <RouterLink to="/privacy">개인정보처리방침</RouterLink>을 함께 참고해 주세요.
      </p>
    </div>
  </article>
</template>

<style scoped>
.contact-page {
  position: relative;
}
</style>
