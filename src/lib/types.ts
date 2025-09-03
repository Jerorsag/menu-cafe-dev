export type CategorySlug = 'panaderia' | 'bebidas-calientes' | 'bebidas-frias' | 'snacks';

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  isPopular: boolean;
  catSlug: CategorySlug | string; // si tu Strapi manda 'BEBIDAS-CALIENTES', lo normalizamos
  imageUrl: string;
  imageAlt: string;
}

export interface MenuPayload {
  title: string;
  subtitle: string;
  products: Product[];
}

export const CATEGORY_LABEL: Record<string, string> = {
  'panaderia': 'Panadería',
  'bebidas-calientes': 'Bebidas calientes',
  'bebidas-frias': 'Bebidas frías',
  'snacks': 'Snacks',
};