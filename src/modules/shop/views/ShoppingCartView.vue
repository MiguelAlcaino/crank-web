<script setup lang="ts">
import { ApiService } from '@/services/apiService';
import ShoppingCartItem from '../components/ShoppingCartItem.vue';
import { inject } from 'vue';
import { useShoppingCart } from '../composables/userShoppingCart';

const { isLoading, hasError, shoppingCart, addToCart, removeFromCart, removeAllFromCart, updateItemInShoppingCart } =
    useShoppingCart(inject<ApiService>('gqlApiService')!)

const emit = defineEmits(['update:modelValue', 'removeItem']);


const handleRemoveItem = (shoppingCartItemId: string) => {
    const item = shoppingCart.value?.items.find(item => item.id === shoppingCartItemId);
    if (item) {
        removeFromCart(item.id);
    }
};

const handleUpdateItem = (sellableProductId: string, quantity: number) => {
    console.log(sellableProductId, quantity);
    const item = shoppingCart.value?.items.find(item => item.product.id === sellableProductId)
    if (item) {
        updateItemInShoppingCart(sellableProductId, quantity);
    }
};
</script>

<template>
    <div>
        <div class="row">
            <div class="col-7">
                <div v-for="(shoppingCartItem, index) in shoppingCart?.items" :key="index">
                    <ShoppingCartItem :shopping-cart-item="shoppingCartItem" @remove-item="handleRemoveItem"
                        @update-item="handleUpdateItem">
                    </ShoppingCartItem>
                    <hr>
                </div>
            </div>
            <div class="col-5">
                {{ shoppingCart?.subTotal }}
                {{ shoppingCart?.total }}
            </div>
        </div>
    </div>
</template>



<style lang="css" scoped src="bootstrap/dist/css/bootstrap.min.css"></style>
<style lang="css" scoped src="@/assets/main.css"></style>
<style scoped></style>