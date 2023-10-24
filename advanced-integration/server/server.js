import "dotenv/config";
import express from "express";
import cors from "cors";
import * as paypal from "./paypal-api.js";
const { PORT = 8888 } = process.env;

const app = express();
app.set("view engine", "ejs");

app.use(cors());

app.use(express.static("public"));

app.get('/health', (req, res) => {
  res.send('OK')
});

// render checkout page with client id & unique client token
app.get("/", async (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  try {
    const clientToken = await paypal.generateClientToken();
    res.render("checkout", { clientId, clientToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get client token
app.get('/client-token', async (req, res) => {
  const clientToken = await paypal.generateClientToken();

  res.json({ clientToken });
})

// create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await paypal.capturePayment(orderID);

    const card = captureData.payment_source.card;

    if (card) {

      const vaultStatus = card.attributes.vault.status;

      if (vaultStatus !== 'VAULTED')
        console.error('Card not vaulted');

      const lastDigits = card.last_digits;
      const vaultId = card.attributes.vault.id;
      const customerId = card.attributes.vault.customer.id;

      console.log(`
Card successfully vaulted!
---
Card last digits: ${lastDigits}
Vault id        : ${vaultId}
Customer id     : ${customerId}
---
      `);
    }

    res.json(captureData);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
