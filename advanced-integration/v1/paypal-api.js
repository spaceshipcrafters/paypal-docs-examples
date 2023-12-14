import fetch from "node-fetch";

// set some important variables
const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_CUSTOMER_ID,
  PAYPAL_PURCHASE_AMOUNT,
  PAYPAL_PURCHASE_CURRENCY
} = process.env;
const base = "https://api-m.sandbox.paypal.com";

/**
 * Create an order using the JS SDK
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export async function createJsSdkOrder() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: PAYPAL_PURCHASE_CURRENCY,
            value: PAYPAL_PURCHASE_AMOUNT,
          },
        },
      ]
    }),
  });

  return handleResponse(response);
}

/**
 * Create an order using the Orders API
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export async function createOrdersApiOrder() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: PAYPAL_PURCHASE_CURRENCY,
            value: PAYPAL_PURCHASE_AMOUNT,
          },
        },
      ],

      // Per https://developer.paypal.com/limited-release/vault-payment-methods/orders-api/#link-modifyyourintegration
      payment_source: {
        paypal: {
            attributes: {
                customer: {
                    id: PAYPAL_CUSTOMER_ID
                },
                vault: {
                    confirm_payment_token: "ON_ORDER_COMPLETION",
                    usage_type: "MERCHANT",
                    customer_type: "CONSUMER"
                }
            },
            experience_context: {
              return_url: 'http://localhost:8888',
              cancel_url: 'http://localhost:8888'
            }
        }
      }

    }),
  });

  return handleResponse(response);
}

/**
 * Capture payment for an order
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

/**
 * Generate an OAuth 2.0 access token
 * @see https://developer.paypal.com/api/rest/authentication/
 */
export async function generateAccessToken() {
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
  ).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

/**
 * Generate a client token
 * @see https://developer.paypal.com/docs/checkout/advanced/integrate/#link-sampleclienttokenrequest
 */
export async function generateClientToken() {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${base}/v1/identity/generate-token`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_id: PAYPAL_CUSTOMER_ID,
    }),
  });
  console.log("response", response.status);
  const jsonData = await handleResponse(response);
  return jsonData.client_token;
}

/**
 * Get payment tokens
 */
export async function getPaymentTokens() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/vault/payment-tokens?customer_id=${PAYPAL_CUSTOMER_ID}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  });

  const jsonData = await handleResponse(response);
  return jsonData.payment_tokens;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}
