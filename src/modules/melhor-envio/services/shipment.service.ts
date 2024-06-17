import {
  MELHOR_ENVIO_API,
  MELHOR_ENVIO_API_PROD,
} from '../melhor-envio.constants';
import { ShipmentCalculateDTO } from '../melhor-envio.interface';
import { fetchApi } from '../melhor-envio.service';

export const Shipment = (
  token: string,
  environment: 'homologacao' | 'producao',
) => {
  const api = fetchApi(token);

  const apiUrl =
    environment === 'homologacao' ? MELHOR_ENVIO_API : MELHOR_ENVIO_API_PROD;

  return {
    checkout: async (orders: string[]) => {
      return api.post<any[]>(`${apiUrl}me/shipment/checkout`, {
        orders,
      });
    },
    generate: async (orders: string[]) => {
      return api.post<any[]>(`${apiUrl}me/shipment/generate`, {
        orders,
      });
    },
    preview: async (orders: string[]) => {
      return api.post<any[]>(`${apiUrl}me/shipment/preview`, {
        orders,
      });
    },
    calculate: async (shipmentCalculateDTO: ShipmentCalculateDTO) => {
      return api.post<any[]>(`${apiUrl}me/shipment/calculate`, {
        from: {
          postal_code: shipmentCalculateDTO.from,
        },
        to: {
          postal_code: shipmentCalculateDTO.to,
        },
        volumes: shipmentCalculateDTO.volumes,
      });
    },
  };
};
