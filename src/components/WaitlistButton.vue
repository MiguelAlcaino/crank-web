<script setup lang="ts">
import type { Class } from "@/gql/graphql";

const props = defineProps<{
    classInfo: Class,
}>();

const emits = defineEmits<{
    (event: "clickBookWaitList", classId: string, spotNumber: number | null, isWaitlistBooking: boolean | null): void
}>();

function onClickWaitListButton(): void {
    emits("clickBookWaitList", props.classInfo.id, null, true);
}
</script>

<template>
    <div>
        <div class="text-center">
            <a type="button" @click="onClickWaitListButton()" class="btn btn-primary btn-cons waves-effect waves-light"
                style="">
                <i class="fa fa-bullseye" aria-hidden="true"></i>
                <div>Enroll on the WaitList</div>
            </a>
        </div>
    </div>
</template>

<style scoped>
.btn-primary {
    color: #fff;
    background-color: #000000;
    border-color: #000000;
}
</style>
