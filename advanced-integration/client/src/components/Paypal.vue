<script setup lang="ts">
import { onMounted } from 'vue';
import CardForm from './CardForm.vue';
import paypal from './paypal';
import { createOrder, captureOrder } from './api';

onMounted(async () => {

  await paypal?.Buttons!({
    createOrder: async function() {
      return await createOrder();
    },
    onApprove: async function(data) {
      await captureOrder(data.orderID);
    }
  }).render('#paypal-button-container');
});

</script>

<template>

  <div id="paypal-button-container"></div>
  <CardForm />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
