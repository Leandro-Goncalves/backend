export interface MelhorEnvioModuleOptions {
  global?: boolean;
  token: string;
}

interface Product {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
}

interface CartProduct {
  name: string;
  quantity: string;
  unitary_value: string;
}

export interface ShipmentCalculateDTO {
  from: string;
  to: string;
  volumes: Product[];
}

export interface AddToCartDTO {
  serviceId: string;
  products: CartProduct[];
  insuranceValue?: number;
  volumes: Omit<Product, 'id' | 'quantity'>[];
  to: {
    name: string;
    email: string;
    document: string;
    address: string;
    number: string;
    district: string;
    city: string;
    phone: string;
    postal_code: string;
    complement?: string;
  };
}
