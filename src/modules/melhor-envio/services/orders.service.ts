import { MELHOR_ENVIO_API } from '../melhor-envio.constants';
import { fetchApi } from '../melhor-envio.service';

export const Orders = (token: string) => {
  const api = fetchApi(token);

  return {
    get: async (order: string) => {
      return api.get<{ id: string; tracking: string }>(
        `${MELHOR_ENVIO_API}me/orders/${order}`,
      );
    },
  };
};
