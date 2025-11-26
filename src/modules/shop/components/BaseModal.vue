<script lang="ts">
interface Props {
  modelValue: boolean
  title: string
  message: string
  cancelText?: string | null
  okText?: string | null
  okLoading?: boolean
  cancelLoading?: boolean
  okDisabled?: boolean
  cancelDisabled?: boolean
  closable?: boolean
}
</script>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  cancelText: 'Cancel',
  okText: 'OK',
  okLoading: false,
  cancelLoading: false,
  cancelDisabled: false,
  okDisabled: false,
  closable: true
})

const emits = defineEmits<{
  (e: 'ok'): void
  (e: 'cancel'): void
  (e: 'update:modelValue', value: boolean): void
}>()

function handleCancel() {
  emits('cancel')
  closeModal()
}

function handleOk() {
  emits('ok')
}

function closeModal() {
  emits('update:modelValue', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal-mask" @click.self="handleCancel">
      <div class="modal-wrapper">
        <div
          class="modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          aria-describedby="modalBody"
        >
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 id="modalTitle" class="modal-title">{{ title }}</h5>
              <button
                v-if="closable"
                type="button"
                class="close"
                aria-label="Cerrar"
                @click="handleCancel"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div id="modalBody" class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer border-0">
              <button
                v-if="cancelText !== null"
                type="button"
                class="btn btn-default"
                :disabled="cancelDisabled || cancelLoading || okLoading"
                @click="handleCancel"
              >
                {{ cancelText }}
                <span
                  v-if="cancelLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
              <button
                v-if="okText !== null"
                class="btn btn-primary"
                type="button"
                :disabled="okLoading || okDisabled || cancelLoading"
                @click="handleOk"
              >
                {{ okText }}
                <span
                  v-if="okLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style lang="css" scoped>
p {
  font-family: 'Avenir', sans-serif;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
