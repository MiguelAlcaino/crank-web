<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  inputId: string
}>()

declare global {
  interface Window {
    io_install_stm: boolean
    io_exclude_stm: number
    io_install_flash: boolean
    io_enable_rip: boolean
    io_bbout_element_id: string
  }
}

// Function to load external script
const loadScript = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Script load error'))
    document.body.appendChild(script)
  })
}

// Fingerprint configuration and script loading
onMounted(() => {
  window.io_bbout_element_id = props.inputId
  window.io_install_stm = false
  window.io_exclude_stm = 0
  window.io_install_flash = false
  window.io_enable_rip = true

  // Load Snare.js script
  loadScript('https://mpsnare.iesnare.com/snare.js')
    .then(() => {
      console.log('Snare.js successfully loaded')
    })
    .catch((error) => {
      console.error('Error loading Snare.js:', error)
    })
})
</script>

<template>
  <input type="hidden" :id="inputId" />
</template>

<style scoped></style>
