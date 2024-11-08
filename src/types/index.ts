export interface CityResponse {
    id: number;
    name: string;
  }
  
  export interface OngkirRequest {
    origin: number | null;
    destination: number | null;
    weight: number | null;
    courier: string | null;
  }
  
  export interface Cost {
    value: number;
    etd: string;
    note: string;
  }
  
  export interface ShippingCost {
    service: string;
    description: string;
    cost: Cost[];
  }
  
  export interface OngkirResponse {
    code: string;
    name: string;
    costs: ShippingCost[];
  }