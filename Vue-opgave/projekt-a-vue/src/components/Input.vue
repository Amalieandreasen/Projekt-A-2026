<template>
  <div class="outDiv">
    <label>
      Skriv noget:
      <!-- v-model: tovejsbinding mellen input og variabel -->
      <input
        type="text"
        v-model="originalText"
        placeholder="Prøv fx: <script>alert('hack')</script>" />
    </label>
  </div>
  <div class="results">
    <div class="resultCard">
      <h3>original Tekst</h3>
      <!-- interpolation -->
      <span class="originalText">{{ originalText }}</span>
    </div>
    <div class="resultCard">
      <h3>Renset tekst</h3>
      <span class="sanitizedtext">{{ sanitizedText }}</span>
    </div>
  </div>
</template>

<script setup>
// ref gør værdier reaktive
import { ref, watch } from "vue";
const originalText = ref("");
const sanitizedText = ref("");

// hver gang originaltext ændrer sig, køre denne funktion
watch(originalText, (newValue) => {
  // fjerner script start tags
  let cleaned = newValue.replace(/<script.*?>/gi, "");
  // fjerner script lukke tags
  cleaned = cleaned.replace(/<\/script>/gi, "");
  // fjerner inline event attributter
  cleaned = cleaned.replace(/on\w+=(["']).*?\1/gi, "");
  sanitizedText.value = cleaned;
});
</script>
<style scoped>
.resultCard {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.288);
  padding: 5em;
  border-radius: 8px;
}
.results {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 600px;
  max-width: 800px;
  justify-content: center;
  align-items: center;
}
label {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 30px;
}
input {
  padding-block: 5px;
  padding-inline: 15px;
  border-radius: 8px;
  border-color: rgba(128, 128, 128, 0.582);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.288);
}
.outDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.originalText {
  color: red;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}

.sanitizedtext {
  color: green;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
}
</style>
