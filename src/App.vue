<script setup lang="ts">
import BaseModal from '@/modules/shop/components/BaseModal.vue'
import { useModal } from '@/modules/shared/composables/useModal'

const { isVisible, title, message, handleConfirm, handleCancel } = useModal()
</script>

<template>
  <router-view></router-view>

  <BaseModal
    v-model="isVisible"
    :title="title"
    :message="message"
    okText="OK"
    cancelText="CANCELAR"
    @ok="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<style scoped></style>
