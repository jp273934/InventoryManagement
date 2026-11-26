export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  unitPrice: number;
  quantityInStock: number;
  reorderLevel: number;
  createdDate: string;
  isLowStock: boolean;
}

export interface CreateProduct {
  name: string;
  sku: string;
  description: string | null;
  unitPrice: number;
  quantityInStock: number;
  reorderLevel: number;
}

export interface UpdateProduct extends CreateProduct {
}