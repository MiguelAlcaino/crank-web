<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  checkLayoutError: string | null
  isLoading: boolean
}>()

const emits = defineEmits<{
  (e: 'goToLayoutEditPage'): void
  (e: 'removeLayout'): void
  (e: 'assignPiqId', piqClassId: string): void
}>()

const selectedPiqId = ref<string | null>(null)

function assignPiqId() {
  if (selectedPiqId.value) emits('assignPiqId', selectedPiqId.value as string)
}
</script>
<template>
  <div
    v-if="checkLayoutError === 'PIQClassHasNoRoomLayoutError'"
    class="alert alert-danger"
    role="alert"
  >
    <p>
      The PIQ's class does not have a layout asigned. Click this button to remove the layout from
      this class
      <button
        class="btn btn-primary btn-sm"
        type="button"
        :disabled="isLoading"
        @click="emits('removeLayout')"
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          v-if="isLoading"
        ></span>
        <span class="sr-only"> {{ isLoading ? 'Removing Layout..' : 'Remove Layout' }}</span>
      </button>
    </p>
  </div>
  <div
    v-else-if="checkLayoutError === 'RoomLayoutMatchError'"
    class="alert alert-danger"
    role="alert"
  >
    <p>
      The layout of this class does not match the layout of PIQ. Click here to edit the Room Layout
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="emits('goToLayoutEditPage')"
        :disabled="isLoading"
      >
        Edit Layout
      </button>
    </p>
  </div>
  <div
    v-else-if="checkLayoutError === 'PIQClassNotLinkedError'"
    class="alert alert-danger"
    role="alert"
  >
    <div class="row mb-3">
      <label for="piqId" class="col-sm-5 col-form-label"
        >This class is not linked to a PIQ class, please enter the PIQ's class id here</label
      >
      <div class="col-sm-2">
        <input
          type="number"
          class="form-control"
          id="piqId"
          min="1"
          :disabled="isLoading"
          v-model="selectedPiqId"
        />
      </div>
      <div class="col-sm-5">
        <button
          class="btn btn-primary btn-sm"
          type="button"
          :disabled="isLoading || selectedPiqId === null || selectedPiqId === ''"
          @click="assignPiqId"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="isLoading"
          ></span>
          <span class="sr-only"> {{ isLoading ? 'Assigning..' : 'Assign' }}</span>
        </button>
        to fix
      </div>
    </div>
  </div>
  <div v-else-if="checkLayoutError === 'UnknownError'" class="alert alert-danger" role="alert">
    <p>An error has occurred while trying to check the layout of the class with PIQ</p>
  </div>
</template>

<style></style>
