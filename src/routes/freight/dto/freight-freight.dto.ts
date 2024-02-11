export class SearchFreightDto {
  from: string;
  to: string;
  volumes: Product[];
}

interface Product {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
}
