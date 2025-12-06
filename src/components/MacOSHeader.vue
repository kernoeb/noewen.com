<script setup lang="ts">
defineProps({
  headerTitle: {
    type: String,
    default: '',
  },
  titleClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'minimize', 'maximize'])
</script>

<template>
  <div class="macos-header">
    <div class="d-flex align-center">
      <button
        aria-label="Close"
        class="traffic-light red"
        @click="emit('close')"
      />
      <button
        aria-label="Minimize"
        class="traffic-light yellow"
        @click="emit('minimize')"
      />
      <button
        aria-label="Maximize"
        class="traffic-light green"
        @click="emit('maximize')"
      />
    </div>
    <div class="header-title" :class="titleClass">
      {{ headerTitle }}
    </div>
    <div class="spacer" />
  </div>
</template>

<style scoped>
.macos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  margin-right: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.traffic-light:hover {
  opacity: 0.8;
}

.traffic-light.red {
  background: #ff5f57;
}

.traffic-light.yellow {
  background: #febc2e;
}

.traffic-light.green {
  background: #28c840;
}

.header-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.01em;
}

.spacer {
  width: 60px;
}
</style>
