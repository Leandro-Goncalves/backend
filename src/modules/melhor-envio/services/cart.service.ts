import { MELHOR_ENVIO_API } from '../melhor-envio.constants';
import { AddToCartDTO } from '../melhor-envio.interface';
import { fetchApi } from '../melhor-envio.service';

const defaultAddress = {
  name: 'Cacau Store',
  phone: '19991824852',
  document: '43719655806',
  address: 'Rua José Alves',
  number: '210',
  district: 'Conjunto Habitacional Francisco Garófalo',
  city: 'Mococa',
  postal_code: '13736815',
};

export const Cart = (token: string) => {
  const api = fetchApi(token);

  return {
    add: async (addToCartDTO: AddToCartDTO) => {
      return api.post<{ id: string }>(`${MELHOR_ENVIO_API}me/cart`, {
        service: addToCartDTO.serviceId,
        from: defaultAddress,
        to: addToCartDTO.to,
        products: addToCartDTO.products,
        volumes: addToCartDTO.volumes,
      });
    },
  };
};
