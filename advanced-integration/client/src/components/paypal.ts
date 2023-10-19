import { loadScript } from "@paypal/paypal-js";
import { getClientToken } from "./api";
import { clientId } from "@/config";

const dataClientToken = await getClientToken();

const paypal = await loadScript({
    clientId,
    dataClientToken,
    components: "buttons,hosted-fields"
});

export default paypal;