import {
  MELHOR_ENVIO_API,
  MELHOR_ENVIO_API_PROD,
} from '../melhor-envio.constants';
import { fetchApi } from '../melhor-envio.service';

export const Orders = (
  token: string,
  environment: 'homologacao' | 'producao',
) => {
  const apiUrl =
    environment === 'homologacao' ? MELHOR_ENVIO_API : MELHOR_ENVIO_API_PROD;
  const api = fetchApi(token);

  return {
    get: async (order: string) => {
      return api.get<{ id: string; tracking: string }>(
        `${apiUrl}me/orders/${order}`,
      );
    },
  };
};
