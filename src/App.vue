<script setup lang="ts">
import { ref, provide } from "vue";
import AppLayout from "./components/AppLayout.vue";
import CookieConsentBar from "./components/CookieConsentBar.vue";
import { readAdConsent, AD_CONSENT_KEY, type AdConsent } from "./lib/consent";

const adConsent = ref<AdConsent | null>(readAdConsent());
provide(AD_CONSENT_KEY, adConsent);

function onAdConsent(v: AdConsent) {
  adConsent.value = v;
}
</script>

<template>
  <CookieConsentBar @consent="onAdConsent" />
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
