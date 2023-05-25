<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'buy'): void
}>()
</script>
<template>
  <VueFinalModal
    class="confirm-modal"
    content-class="confirm-modal-content"
    :click-to-close="false"
  >
    <h1 class="text-xl">ERROR</h1>
    <p>YOU DO NOT HAVE SUFFICIENT CREDITS IN YOUR ACCOUNT.</p>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" @click="emit('close')">CANCEL</button>

      <button type="button" class="btn btn-primary" @click="emit('buy')">
        {{ 'BUY' }}
      </button>
    </div>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0rem;
}

.confirm-modal-content > * + * {
  margin: 0.5rem 0;
}

.confirm-modal-content h1 {
  font-size: 1.375rem;
}

.confirm-modal-content button {
  margin: 0.2rem;
  border: 0px solid;
  border-radius: 0rem;
}

.dark .confirm-modal-content {
  background: #000;
}
</style>
