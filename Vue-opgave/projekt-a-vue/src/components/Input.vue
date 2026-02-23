<template>
  <div class="outDiv">
    <label>
      Skriv noget:
      <input type="text" v-model="originalText" />
    </label>
    <span class="originalText">{{ originalText }}</span>
    <span class="sanitizedtext">{{ sanitizedText }}</span>
    <span v-html="sanitizedText" class="sanitizedtext"></span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const originalText = ref("");
const sanitizedText = ref("");

watch(originalText, (newValue) => {
  let cleaned = newValue.replace(/<script.*?>/gi, "");
  cleaned = cleaned.replace(/<\/script>/gi, "");
  cleaned = cleaned.replace(/on\w+=(["']).*?\1/gi, "");
  sanitizedText.value = cleaned;
});
</script>
<style scoped>
.outDiv {
  display: flex;
  flex-direction: column;
}

.originalText {
  color: red;
}

.sanitizedtext {
  color: green;
}
</style>
