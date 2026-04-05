<script setup lang="ts">
import { ref, provide, watch } from "vue";
import AppLayout from "./components/AppLayout.vue";
import CookieConsentBar from "./components/CookieConsentBar.vue";
import { readAdConsent, AD_CONSENT_KEY, type AdConsent } from "./lib/consent";
import { getAdClient, loadDisplayAdScript } from "./lib/displayAds";

const adConsent = ref<AdConsent | null>(readAdConsent());
provide(AD_CONSENT_KEY, adConsent);

function onAdConsent(v: AdConsent) {
  adConsent.value = v;
}

watch(
  adConsent,
  (v) => {
    if (v === "granted" && getAdClient()) void loadDisplayAdScript();
  },
  { immediate: true }
);
</script>

<template>
  <CookieConsentBar @consent="onAdConsent" />
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
