import { MELHOR_ENVIO_API } from '../melhor-envio.constants';
import { ShipmentCalculateDTO } from '../melhor-envio.interface';
import { fetchApi } from '../melhor-envio.service';

export const Shipment = (token: string) => {
  const api = fetchApi(token);

  return {
    checkout: async (orders: string[]) => {
      return api.post<any[]>(`${MELHOR_ENVIO_API}me/shipment/checkout`, {
        orders,
      });
    },
    generate: async (orders: string[]) => {
      return api.post<any[]>(`${MELHOR_ENVIO_API}me/shipment/generate`, {
        orders,
      });
    },
    preview: async (orders: string[]) => {
      return api.post<any[]>(`${MELHOR_ENVIO_API}me/shipment/preview`, {
        orders,
      });
    },
    calculate: async (shipmentCalculateDTO: ShipmentCalculateDTO) => {
      return api.post<any[]>(`${MELHOR_ENVIO_API}me/shipment/calculate`, {
        from: {
          postal_code: shipmentCalculateDTO.from,
        },
        to: {
          postal_code: shipmentCalculateDTO.to,
        },
        products: shipmentCalculateDTO.products,
      });
    },
  };
};
