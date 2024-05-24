<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  page: number
  limit: number
  total: number
}>()

const emits = defineEmits<{
  (e: 'pageChanged', page: number): void
}>()

watch(
  () => props.total || props.limit,
  () => {
    totalPages.value = Math.ceil(props.total / props.limit)
  }
)

onMounted(() => {
  totalPages.value = Math.ceil(props.total / props.limit)
})

const totalPages = ref<number>(1)
const currentPage = ref(props.page)

const pagesToShow = computed(() => {
  // Generate an array of numbers from 1 to totalPages
  const allPages = Array.from({ length: totalPages.value }, (_, i) => i + 1)
  // Filter the array to get only the pages you want to display
  return allPages.filter((n) => n > currentPage.value - 4 && n < currentPage.value + 4)
})

function changePage(page: number) {
  if (currentPage.value === page) return

  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emits('pageChanged', page)
  }
}
</script>

<template>
  <nav aria-label="Page navigation example" v-if="total > 0">
    <ul class="pagination">
      <!-- Previous -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a
          class="page-link"
          href="#"
          @click.prevent="changePage(currentPage - 1)"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <!-- First -->
      <li class="page-item" v-if="currentPage > 4">
        <a class="page-link" href="#" @click.prevent="changePage(1)">1</a>
      </li>

      <li class="page-item disabled" v-if="currentPage > 5">
        <a class="page-link" href="#">...</a>
      </li>
      <li
        v-for="n in pagesToShow"
        class="page-item"
        :key="n"
        :class="{ active: n === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(n)">{{ n }}</a>
      </li>
      <li class="page-item disabled" v-if="currentPage < totalPages - 4">
        <a class="page-link" href="#">...</a>
      </li>

      <!-- Last -->
      <li class="page-item" v-if="currentPage < totalPages - 3">
        <a class="page-link" href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
      </li>
      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a
          class="page-link"
          href="#"
          @click.prevent="changePage(currentPage + 1)"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>

<style scoped>
a {
  font-family: 'Avenir', sans-serif;
  color: black !important;
}

.page-item.active .page-link {
  background-color: #000000 !important;
  border-color: #000000 !important;
  color: white !important;
}
</style>
