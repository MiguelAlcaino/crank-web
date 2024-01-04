<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-4">
        <side-menu></side-menu>
      </div>
      <div class="col-lg-9 col-md-9 col-sm-8">
        <div class="card">
          <div class="card-body">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
