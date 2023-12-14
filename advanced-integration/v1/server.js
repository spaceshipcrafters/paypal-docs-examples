import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";
const { PORT = 8888 } = process.env;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// render checkout page with client id & unique client token
app.get("/", async (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const currency = process.env.PAYPAL_PURCHASE_CURRENCY;
  try {
    const clientToken = await paypal.generateClientToken();
    res.render("checkout", { clientId, clientToken, currency });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order with JS SDK flow
app.post("/api/jssdk/orders", async (req, res) => {
  try {
    const order = await paypal.createJsSdkOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order with Orders API flow
app.post("/api/ordersapi/orders", async (req, res) => {
  try {
    const order = await paypal.createOrdersApiOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment with JS SDK flow
app.post("/api/jssdk/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await paypal.capturePayment(orderID);

    console.log('CAPTURE response', captureData);

    const paymentTokens = await paypal.getPaymentTokens();

    console.log('Payment tokens', paymentTokens);

    res.json(paymentTokens);

  } catch (err) {
    console.error('Error capturing order and acquiring payment tokens: ', err);
    res.status(500).send(err.message);
  }
});

// capture payment with Orders API flow
app.post("/api/ordersapi/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await paypal.capturePayment(orderID);
    const {
      id: transactionId,
      status: transactionStatus
    } = captureData.purchase_units[0].payments.captures[0];

    console.log('CAPTURE response', captureData);

    const paymentToken = captureData.payment_source.paypal.attributes?.vault?.id;

    console.log('Payment token:', paymentToken);

    res.json({
      transactionId,
      transactionStatus,
      paymentToken
    });

  } catch (err) {
    console.error('Error capturing order and acquiring payment tokens: ', err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
