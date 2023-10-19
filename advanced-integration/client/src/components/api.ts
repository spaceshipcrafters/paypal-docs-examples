import { apiBaseUrl } from '@/config';

const getClientToken = async (): Promise<string> => {

    const response = await fetch(`${apiBaseUrl}/client-token`);
    const { clientToken } = await response.json();

    return clientToken;
};

const createOrder = async (): Promise<string> => {

    const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST'
    });

    if (response.status >= 400)
        throw new Error('Failed to create order: ' + response.statusText);

    const { id } = await response.json();

    return id;
};

const captureOrder = async (orderId: string): Promise<void> => {

    const response = await fetch(`${apiBaseUrl}/api/orders/${orderId}/capture`, {
        method: 'POST'
    });

    if (response.status >= 400)
        throw new Error('Failed to create order: ' + response.statusText);
};

export {
    getClientToken,
    createOrder,
    captureOrder
};