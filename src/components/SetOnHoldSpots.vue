<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
import type { ApiService } from '@/services/apiService'

import { helpers, minValue, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { ERROR_UNKNOWN } from '@/utils/errorMessages'

import DefaultButtonComponent from '@/components/DefaultButtonComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

const apiService = inject<ApiService>('gqlApiService')!

const modalIsVisible = ref<boolean>(false)
const isSaving = ref<boolean>(false)
const errorModalIsVisible = ref<boolean>(false)

const formData = reactive({
  onHoldSpots: 0
})

const rules = computed(() => {
  return {
    onHoldSpots: {
      required: helpers.withMessage('On Hold Spots is required', required),
      minValue: helpers.withMessage('On Hold Spots must be higher than 0', minValue(0))
    }
  }
})

const v$ = useVuelidate(rules, formData)

const props = defineProps<{
  classId: string
  onHoldSpots: number
}>()

const emits = defineEmits<{
  (event: 'afterSetOnHoldSpots'): void
}>()

function onClickSetOnHoldSpots(): void {
  formData.onHoldSpots = props.onHoldSpots
  modalIsVisible.value = true
}

async function saveOnHoldSpots() {
  const isValid = await v$.value.$validate()
  if (isValid) {
    isSaving.value = true
    const response = await apiService.editClass({
      classId: props.classId,
      onHoldSpots: formData.onHoldSpots
    })
    isSaving.value = false

    if (response.updated) {
      emits('afterSetOnHoldSpots')
      modalIsVisible.value = false
    } else {
      errorModalIsVisible.value = true
    }
  }
}
</script>

<template>
  <DefaultButtonComponent
    :text="'Set On Hold Spots (' + props.onHoldSpots + ')'"
    type="button"
    @on-click="onClickSetOnHoldSpots()"
  ></DefaultButtonComponent>

  <transition name="modal" v-if="modalIsVisible">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title">On Hold Spots</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" @click="modalIsVisible = false">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
                Current On Hold Spots: <b>{{ props.onHoldSpots }}</b>
              </p>
              <label for="onHoldSpotsInput" class="input-label">On Hold Spots:</label>
              <input
                id="onHoldSpotsInput"
                class="form-control"
                type="number"
                placeholder="On Hold Spots"
                required
                v-model="formData.onHoldSpots"
              />
              <small
                v-for="error in v$.onHoldSpots.$errors"
                :key="error.$uid"
                class="form-text"
                style="color: red"
              >
                {{ error.$message }}
              </small>
            </div>
            <div class="modal-footer border-0">
              <DefaultButtonComponent
                text="Set On Hold Spots"
                type="button"
                :is-loading="isSaving"
                @on-click="saveOnHoldSpots()"
              ></DefaultButtonComponent>

              <DefaultButtonComponent
                text="Cancel"
                type="button"
                :disabled="isSaving"
                variant="secondary"
                @on-click="modalIsVisible = false"
              ></DefaultButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Error Modal -->
  <ModalComponent
    v-if="errorModalIsVisible"
    title="ERROR"
    :message="ERROR_UNKNOWN"
    :cancel-text="null"
    ok-text="OK"
    @on-ok="errorModalIsVisible = false"
  >
  </ModalComponent>
</template>

<style scoped></style>
