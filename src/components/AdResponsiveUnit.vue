<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getAdClient, loadDisplayAdScript, pushAdPlacement } from "../lib/displayAds";

const props = withDefaults(
  defineProps<{
    adSlot?: string;
    minHeight?: string;
  }>(),
  {
    adSlot: "",
    minHeight: "120px",
  }
);

const pushed = ref(false);

const client = getAdClient();
const slot = () => props.adSlot?.trim() || "";

onMounted(async () => {
  if (!client || !slot() || pushed.value) return;
  await nextTick();
  await loadDisplayAdScript();
  pushAdPlacement();
  pushed.value = true;
});
</script>

<template>
  <div
    v-if="client && slot()"
    class="ad-unit"
    :style="{ minHeight }"
    aria-label="광고"
  >
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="client"
      :data-ad-slot="slot()"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </div>
</template>

<style scoped>
.ad-unit {
  margin: 1rem auto;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
