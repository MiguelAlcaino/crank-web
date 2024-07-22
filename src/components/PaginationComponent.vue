<script lang="ts">
interface PagePosition {
  pageNumber: number
  pageLabel: string
}
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

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
    generatePagePositions()
  }
)

onMounted(() => {
  totalPages.value = Math.ceil(props.total / props.limit)
  generatePagePositions()
})

const totalPages = ref<number>(1)
const currentPage = ref(props.page)
const pages = ref<PagePosition[]>([])

const pagesBeforeAfter = 4

function changePage(page: number) {
  if (currentPage.value === page) return

  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    generatePagePositions()
    emits('pageChanged', page)
  }
}

function generatePagePositions() {
  const pagesArray = []

  const maxPagesToShow = pagesBeforeAfter * 2 + 1

  if (maxPagesToShow >= totalPages.value) {
    for (let i = 1; i <= totalPages.value; i++) {
      pagesArray.push({ pageNumber: i, pageLabel: i.toString() })
    }
  } else {
    var start = currentPage.value - pagesBeforeAfter

    if (start < 1) start = 1
    var end = start + maxPagesToShow - 1

    if (end > totalPages.value) {
      start = start - (end - totalPages.value)
      if (start < 1) start = 1
      end = totalPages.value
    }

    if (start > 1) pagesArray.push({ pageNumber: 1, pageLabel: '1' })

    for (let i = start; i <= end; i++) {
      pagesArray.push({ pageNumber: i, pageLabel: i.toString() })
    }

    if (end < totalPages.value)
      pagesArray.push({ pageNumber: totalPages.value, pageLabel: totalPages.value.toString() })
  }

  pages.value = pagesArray
}
</script>

<template>
  <div class="pagination-wrapper">
    <nav aria-label="Page navigation example" v-if="pages.length > 0">
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

        <li
          v-for="(page, key) in pages"
          class="page-item"
          :key="key"
          :class="{ active: page.pageNumber === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page.pageNumber)">{{
            page.pageLabel
          }}</a>
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
  </div>
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

.pagination-wrapper {
  overflow-x: auto;
  white-space: nowrap;
}

.pagination {
  display: flex;
  flex-wrap: nowrap;
}
</style>
