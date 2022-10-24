<script setup lang="ts">
import { gql } from "@apollo/client";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import type { Country } from "./gql/graphql";

const COUNTRIES_QUERY = gql`
  query Countries {
    countries {
      name
      code
    }
  }
`;

const { result, error, loading } = useQuery(COUNTRIES_QUERY); // Already reactive objects
/*
 * The following line makes the countries array to be typed. Hence, in the template you could use countries and each
 * element would be typed, meaning that code and name are recognized.
 * The simpler way is to avoid the following line and use result.countries on the template, but the properties of each
 * element would be unknown.
 */
const countries = computed<Country[]>(() => result.value?.countries ?? []);
</script>

<template>
  <div v-if="loading">Loading....</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="country in countries" :key="country.code">
      {{ country.code }}: {{ country.name }}
    </li>
  </ul>
</template>

<style scoped></style>
