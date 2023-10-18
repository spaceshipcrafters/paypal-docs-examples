import { apiBaseUrl } from '@/config';

const getClientToken = async (): Promise<string> => {

    const response = await fetch(`${apiBaseUrl}/client-token`);
    const { clientToken } = await response.json();

    return clientToken;
};

export { getClientToken };