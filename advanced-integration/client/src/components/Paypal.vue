<script setup lang="ts">
import { loadScript } from '@paypal/paypal-js';
import { getClientToken } from './api';
import {
  clientId
} from '@/config';
import { onBeforeMount } from 'vue';

onBeforeMount(async () => {

  const dataClientToken = await getClientToken();

  const paypal = await loadScript({
    clientId,
    dataClientToken,
  });

  paypal?.Buttons!({
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
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
