<script setup lang="ts">
const props = defineProps<{
  iconName: string
}>();

</script>

<template>
  <div>
    <div v-if="iconName=== 'instructor'">
      <font-awesome-icon icon="fa-solid fa-user"/>
    </div>
    <div v-else-if="iconName=== 'speaker'">
      {{ iconName }}
    </div>
    <div v-else-if="iconName=== 'fan'">
      <font-awesome-icon icon="fa-solid fa-fan"/>
    </div>
    <div v-else-if="iconName=== 'tv'">
      <font-awesome-icon icon="fa-solid fa-tv"/>
    </div>
  </div>
</template>

<style scoped></style>
