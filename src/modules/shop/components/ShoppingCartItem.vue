<script setup lang="ts">
import { computed } from 'vue';
import { ShoppingCartItem } from '../interfaces';
import NumberInput from './NumberInput.vue';

const props = defineProps<{
    shoppingCartItem: ShoppingCartItem
}>()


const emits = defineEmits<{
    (e: 'updateItem', sellableProductId: string, quantity: number): void
    (e: 'removeItem', shoppingCartItemId: string): void
}>()

const updateItem = (quantity: number) => {
    emits('updateItem', props.shoppingCartItem.product.id, quantity);
};

const removeItem = () => {
    emits('removeItem', props.shoppingCartItem.id);
};

const subtotal = computed(() => {
    return (props.shoppingCartItem.product.price * props.shoppingCartItem.quantity).toFixed(2);
});

</script>

<template>
    <div>
        <div class="row">
            <div class="col-6">
                <p>{{ shoppingCartItem.product.title }}</p>
                <p>{{ shoppingCartItem.product.price }} {{ shoppingCartItem.product.currency }}</p>
                <NumberInput :model-value="shoppingCartItem.quantity" @update-item="updateItem" :min="1" :max="100"
                    :step="1">
                </NumberInput>
                <button type="button" class="btn btn-link avenir-font" @click="removeItem">remove</button>
            </div>
            <div class="col-6">
                {{ subtotal }}{{ shoppingCartItem.product.currency }}
            </div>
        </div>
    </div>
</template>


<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped>
.avenir-font {
    font-family: 'Avenir', sans-serif;
}
</style>