<script setup lang="ts">
import SpotMatrix from '@/components/SpotMatrix.vue'

const classInfo = {
  matrix: [
    {
      __typename: 'BookableSpot',
      x: 0,
      y: 1,
      spotInfo: {
        isBooked: true,
        spotNumber: 4,
        bookedSpotUserInfo: {
          user: {
            firstName: 'Gabriel',
            lastName: 'Correa'
          }
        }
      }
    },
    {
      __typename: 'BookableSpot',
      x: 2,
      y: 0,
      spotInfo: {
        isBooked: true,
        spotNumber: 3,
        bookedSpotUserInfo: {
          user: {
            firstName: 'Maria Jose',
            lastName: 'Henriquez'
          }
        }
      }
    },
    {
      __typename: 'BookableSpot',
      x: 0,
      y: 0,
      spotInfo: {
        isBooked: true,
        spotNumber: 1,
        bookedSpotUserInfo: {
          user: {
            firstName: 'Miguel',
            lastName: 'Alcaino'
          }
        }
      }
    },
    {
      __typename: 'BookableSpot',
      x: 1,
      y: 0,
      spotInfo: {
        isBooked: true,
        spotNumber: 2,
        bookedSpotUserInfo: {
          user: {
            firstName: 'Sebastian',
            lastName: 'Alcaino'
          }
        }
      }
    },
    {
      __typename: 'IconPosition',
      x: 1,
      y: 1,
      icon: 'speaker'
    }
  ]
}

function spotClicked() {}
</script>

<template>
  <spot-matrix
    v-if="classInfo !== null && classInfo.matrix !== null"
    :matrix="classInfo.matrix"
    :show-user-in-spots="true"
    @click-spot="spotClicked"
  >
  </spot-matrix>
</template>
