export class SearchFreightDto {
  from: string;
  to: string;
  products: Product[];
}

interface Product {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
}
