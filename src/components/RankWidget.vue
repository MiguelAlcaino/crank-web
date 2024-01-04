<script lang="ts">
interface UserInClassRanking {
  genderRanking?: GenderRanking
  totalRanking: UserRanking
}

interface GenderRanking {
  gender?: GenderEnum
  ranking?: UserRanking
}
interface UserRanking {
  positionInRanking?: number
  totalMembersInRanking?: number
}

enum GenderEnum {
  F = 'F',
  M = 'M',
  N = 'N'
}
</script>

<script setup lang="ts">
import type { ApiService } from '@/services/apiService'
import { appStore } from '@/stores/appStorage'
import { inject, ref, watch } from 'vue'

const props = defineProps<{
  classId?: string
}>()

watch(
  () => props.classId,
  (classId) => {
    getCurrentUserRankingInClass(classId)
  }
)

const apiService = inject<ApiService>('gqlApiService')!
const userInClassRanking = ref<UserInClassRanking | null>(null)
const isLoading = ref<boolean>(false)
const ranking = ref<string>('')
const overall = ref<string>('')

async function getCurrentUserRankingInClass(classId?: string) {
  userInClassRanking.value = null
  ranking.value = 'N: '
  overall.value = 'Overall: '

  if (classId) {
    isLoading.value = true
    userInClassRanking.value = (await apiService.getCurrentUserRankingInClass(appStore().site, {
      classId: props.classId
    })) as UserInClassRanking
    isLoading.value = false
  }

  ranking.value = userInClassRanking.value?.genderRanking?.gender ?? ''
  ranking.value += ': '
  ranking.value +=
    userInClassRanking.value?.genderRanking?.ranking?.positionInRanking?.toString() ?? ''
  ranking.value += '/'
  ranking.value +=
    userInClassRanking.value?.genderRanking?.ranking?.totalMembersInRanking?.toString() ?? ''

  overall.value = 'Overall: '
  overall.value += userInClassRanking.value?.totalRanking?.positionInRanking?.toString() ?? ''
  overall.value += '/'
  overall.value += userInClassRanking.value?.totalRanking?.totalMembersInRanking?.toString() ?? ''
}
</script>

<template>
  <div class="row">
    <div class="col-12 text-center">
      <h4>RANK</h4>
    </div>
    <div class="col-6 text-right">
      <i class="bi bi-star-half" style="font-size: 4rem"></i>
    </div>
    <div class="col-6 text-left align-middle">
      <p>{{ ranking }}</p>
      <p>{{ overall }}</p>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
p {
  font-family: 'BigJohn', sans-serif;
  font-size: x-large;
}
h4 {
  color: #737373;
}
</style>
