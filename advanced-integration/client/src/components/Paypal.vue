<script setup lang="ts">
import { onMounted } from 'vue';
import CardForm from './CardForm.vue';
import paypal from './paypal';

onMounted(async () => {

  await paypal?.Buttons!({
    createOrder: function(_, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '0.01'
          }
        }]
      });
    },
    onApprove: async function(_, actions) {
      await actions.order!.capture();
      alert('Transaction completed by ');
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
