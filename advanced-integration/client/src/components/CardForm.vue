<script setup lang="ts">
import { onBeforeMount } from 'vue';
import paypal from './paypal';
import { captureOrder, createOrder } from './api';

onBeforeMount(async () => {
    if (!paypal?.HostedFields?.isEligible())
        console.error("Hosted Fields are not eligible");

    let orderId: string;

    // Renders card fields
    const cf = await paypal?.HostedFields!.render({
        // Call your server to set up the transaction
        createOrder: async () => {
            const id = await createOrder();
            orderId = id;
            return id;
        },
        styles: {
            ".valid": {
                color: "green",
            },
            ".invalid": {
                color: "red",
            },
        },
        fields: {
            number: {
                selector: "#card-number",
                placeholder: "4111 1111 1111 1111",
            },
            cvv: {
                selector: "#cvv",
                placeholder: "123",
            },
            expirationDate: {
                selector: "#expiration-date",
                placeholder: "MM/YY",
            },
        },
    });

    if (!cf)
        console.error("HostedFields could not be rendered");

    document.querySelector("#card-form")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        await cf!.submit();
        await captureOrder(orderId);
    });
});
</script>

<template>
    <form id="card-form">
        <label for="card-number">Card Number</label>
        <div id="card-number" class="card_field"></div>
        <div style="display: flex; flex-direction: row;">
            <div>
                <label for="expiration-date">Expiration Date</label>
                <div id="expiration-date" class="card_field"></div>
            </div>
            <div style="margin-left: 10px;">
                <label for="cvv">CVV</label>
                <div id="cvv" class="card_field"></div>
            </div>
        </div>
        <div>
            <input type="text" id="card-billing-address-zip" name="card-billing-address-zip" autocomplete="off"
                placeholder="zip / postal code" />
        </div>
        <button value="submit" id="submit" class="btn">Pay</button>
    </form>
</template>