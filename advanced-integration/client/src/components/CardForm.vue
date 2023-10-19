<script setup lang="ts">
import { onBeforeMount } from 'vue';
import paypal from './paypal';

onBeforeMount(() => {
    if (paypal?.HostedFields?.isEligible()) {
        // let orderId;

        // Renders card fields
        paypal?.HostedFields!.render({
            // Call your server to set up the transaction
            createOrder: () => {
                return fetch("/api/orders", {
                    method: "post",
                    // use the "body" param to optionally pass additional order information
                    // like product skus and quantities
                    body: JSON.stringify({
                        cart: [
                            {
                                sku: "<YOUR_PRODUCT_STOCK_KEEPING_UNIT>",
                                quantity: "<YOUR_PRODUCT_QUANTITY>",
                            },
                        ],
                    }),
                })
                    .then((res) => res.json())
                    .then((orderData) => {
                        // orderId = orderData.id; // needed later to complete capture
                        return orderData.id;
                    });
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
        }).then((cardFields) => {
            document.querySelector("#card-form")?.addEventListener("submit", async (event) => {
                event.preventDefault();
                await cardFields.submit();
            });
        });
    }
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