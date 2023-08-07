<script lang="ts">
interface DoesRoomLayoutMatchResult {
  __typename: string
  currentRoomLayout?: RoomLayout
  suggestedRoomLayout?: RoomLayout
  matchesPIQRoomLayout?: boolean
  urlToCreateRoomLayout?: string
  urlToFixRoomLayout?: string
}

interface RoomLayout {
  __typename: 'RoomLayout'
  id: string
  name: string
}
</script>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  doesRoomLayoutMatchResult: DoesRoomLayoutMatchResult | null
  isLoading: boolean
}>()

const emits = defineEmits<{
  (e: 'goToLayoutEditPage', url: string): void
  (e: 'removeLayout'): void
  (e: 'assignPiqId', piqClassId: string): void
  (e: 'assignRoomLayoutId', roomLayoutId: string): void
}>()

const selectedPiqId = ref<string | null>(null)

function assignPiqId() {
  if (selectedPiqId.value) emits('assignPiqId', selectedPiqId.value as string)
}
</script>
<template>
  <div v-if="doesRoomLayoutMatchResult === null && isLoading" class="alert alert-info" role="alert">
    Checking class info with PIQ...
  </div>
  <div
    v-else-if="
      doesRoomLayoutMatchResult?.__typename === 'RoomLayoutStructureMatchResult' &&
      doesRoomLayoutMatchResult?.matchesPIQRoomLayout === true
    "
    class="alert alert-success"
    role="alert"
  >
    The class is correctly synchronized with PIQ
  </div>
  <div
    v-else-if="
      doesRoomLayoutMatchResult?.__typename === 'RoomLayoutStructureMatchResult' &&
      doesRoomLayoutMatchResult?.matchesPIQRoomLayout === false
    "
    class="alert alert-danger"
    role="alert"
  >
    <p>
      The layout of this class does not match the layout of PIQ. Click here to edit the Room Layout
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="emits('goToLayoutEditPage', doesRoomLayoutMatchResult!.urlToFixRoomLayout!)"
        :disabled="isLoading"
      >
        Edit Layout
      </button>
    </p>
  </div>
  <div
    v-else-if="doesRoomLayoutMatchResult?.__typename === 'PIQClassNotLinkedError'"
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
          ></span
          >{{ isLoading ? 'Assigning...' : 'Assign' }}
        </button>
        to fix
      </div>
    </div>
  </div>
  <div
    v-else-if="doesRoomLayoutMatchResult?.__typename === 'PIQClassHasNoRoomLayoutError'"
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
        {{ isLoading ? 'Removing Layout..' : 'Remove Layout' }}
      </button>
    </p>
  </div>

  <div
    v-else-if="
      doesRoomLayoutMatchResult?.__typename === 'RoomLayoutIdDoesNotMatchError' &&
      (doesRoomLayoutMatchResult?.suggestedRoomLayout === undefined ||
        doesRoomLayoutMatchResult?.suggestedRoomLayout === null)
    "
    class="alert alert-danger"
    role="alert"
  >
    <p>
      The Room Layout that this class is supposed to have seems to not exist on our side. Click
      <button
        class="btn btn-primary btn-sm"
        type="button"
        :disabled="isLoading"
        @click="emits('goToLayoutEditPage', doesRoomLayoutMatchResult!.urlToCreateRoomLayout!)"
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          v-if="isLoading"
        ></span
        >Here
      </button>
      to bring that room layout from PIQ and assign it to this class.
    </p>
  </div>
  <div
    v-else-if="
      doesRoomLayoutMatchResult?.__typename === 'RoomLayoutIdDoesNotMatchError' &&
      doesRoomLayoutMatchResult?.suggestedRoomLayout?.id !== null
    "
    class="alert alert-danger"
    role="alert"
  >
    <p>
      Hey! The room layout that we have for this class doesn't match what we have on PIQ. We think
      that the layout should be <b>{{ doesRoomLayoutMatchResult?.suggestedRoomLayout?.name }}</b
      >. Click
      <button
        class="btn btn-primary btn-sm"
        type="button"
        :disabled="isLoading"
        @click="emits('assignRoomLayoutId', doesRoomLayoutMatchResult!.suggestedRoomLayout!.id)"
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          v-if="isLoading"
        ></span
        >{{ isLoading ? 'Assigning Layout..' : 'Here' }}
      </button>
      to assign <b>{{ doesRoomLayoutMatchResult?.suggestedRoomLayout?.name }}</b> to this class.
    </p>
  </div>
  <div
    v-else-if="doesRoomLayoutMatchResult?.__typename === 'UnknownError'"
    class="alert alert-danger"
    role="alert"
  >
    <p>An error has occurred while trying to check the layout of the class with PIQ</p>
  </div>
</template>

<style></style>
