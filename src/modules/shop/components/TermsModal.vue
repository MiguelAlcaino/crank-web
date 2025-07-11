<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  mainTitle: {
    type: String,
    default: 'TERMS'
  },
  subTitle: {
    type: String,
    default: 'AND CONDITIONS'
  },
  contentTitle: {
    type: String,
    default: 'TITLE'
  },

  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  closeModal()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
      <!-- Content panel -->
      <div class="modal-content">
        <!-- Close Button -->
        <button @click="closeModal" class="close-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Header -->
        <div class="modal-header">
          <h2 class="main-title">{{ mainTitle }}</h2>
          <h3 class="sub-title">{{ subTitle }}</h3>
        </div>

        <!-- Body with scroll -->
        <div class="modal-body">
          <h4 class="content-title-text">{{ contentTitle }}</h4>
          <div class="content-text">
            <slot>
              <p>{{ content }}</p>
            </slot>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button @click="handleConfirm" class="confirm-button">CONFIRM</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
:root {
  --brand-coral: #ff8c69;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: black;
  color: white;
  border: 4px solid var(--brand-coral, #ff8c69);
  border-radius: 12px;
  padding: 2.5rem;
  width: 90%;
  max-width: 550px;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.main-title {
  font-family: 'BigJohn', 'Arial Black', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 2px;
  margin: 0;
}

.sub-title {
  font-family: 'Avenir', sans-serif;
  color: var(--brand-coral, #ff8c69);
  font-size: 1.5rem;
  letter-spacing: 1px;
  margin: 0;
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 1rem;
}

.content-title-text {
  font-family: 'BigJohn', 'Arial Black', sans-serif;
  color: var(--brand-coral, #ff8c69);
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.content-text {
  font-family: 'Avenir', sans-serif;
  line-height: 1.7;
  font-size: 0.9rem;
  color: #e0e0e0;
}

.modal-footer {
  text-align: center;
  padding-top: 2rem;
}

.confirm-button {
  background-color: var(--brand-coral, #ff8c69);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 1rem 3rem;
  font-family: 'Avenir', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Styles for entrance/exit animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
