<script setup lang="ts">
import {onMounted, ref} from "vue";
import {type BookableSpot, type ClassPositionInterface, IconPosition} from "@/gql/graphql";
import {SpotPosition} from "@/model/SpotPosition";
import BookableSpotPosition from "@/components/BookableSpotPosition.vue"
import IconPositionNotBookable from "@/components/icons/IconPositionNotBookable.vue"

const props = defineProps<{
  matrix: Array<ClassPositionInterface>
}>();

const spotsTable = ref<Array<Array<SpotPosition>>>([]);

onMounted(() => {
  getSpotTable();
});

function getSpotTable() {
  let x = 0;

  let spotsTableRow: Array<SpotPosition> = [];

  for (let i = 0; i < props.matrix.length; i++) {

    let typename: string = props.matrix[i]["__typename"];

    if (typename === "BookableSpot") {
      let classPosition = props.matrix[i] as BookableSpot;

      if (x == classPosition.x) {
        spotsTableRow.push(new SpotPosition("BookableSpot", classPosition.icon, classPosition.spotInfo));
      } else {
        spotsTable.value.push(spotsTableRow);

        spotsTableRow = [];
        x = classPosition.x;

        spotsTableRow.push(new SpotPosition("BookableSpot", classPosition.icon, classPosition.spotInfo));
      }
    }
    if (typename === "IconPosition") {
      let classPosition = props.matrix[i] as IconPosition;

      if (x == classPosition.x) {
        spotsTableRow.push(new SpotPosition("IconPosition", classPosition.icon));
      } else {
        spotsTable.value.push(spotsTableRow);

        spotsTableRow = [];
        x = classPosition.x;

        spotsTableRow.push(new SpotPosition("IconPosition", classPosition.icon));
      }
    }
  }

  spotsTable.value.push(spotsTableRow);
}

</script>

<template>
  <div>
    <table class="table table-borderless">
      <tbody>
      <tr v-for="(colRow, key) in spotsTable" :key="key">
        <td v-for="(spot, key) in colRow" :key="key">
          <BookableSpotPosition v-if="spot.positionType === 'BookableSpot'"
                                :spotInfo="spot.spotInfo"></BookableSpotPosition>

          <IconPositionNotBookable v-if="spot.positionType === 'IconPosition'"
                                   :iconName="spot.positionIcon"></IconPositionNotBookable>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
