import type { MenuPayload, Product } from './types';
import { toAbs, toSlug } from './utils/format';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL as string;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN as string | undefined;

async function sfetch<T>(path: string): Promise<T> {
  const url = `${STRAPI_URL}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => String(res.status));
    throw new Error(`Strapi ${path}: ${res.status} ${msg}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Normaliza la respuesta de /api/menu a {title, subtitle, products[]}
 * Soporta tanto salida "plana" (tu caso) como anidada (v4/v5 con attributes).
 */
function normalizeMenu(json: any): MenuPayload {
  const root = json?.data?.attributes ? json.data.attributes : json?.data ?? {};
  const title = root.title ?? 'Menú';
  const subtitle = root.subtitle ?? '';
  // products puede ser array plano o data[]
  const rawProducts = Array.isArray(root.products?.data) ? root.products.data : (root.products || []);

  const products: Product[] = rawProducts.map((p: any) => {
    const a = p?.attributes ?? p ?? {};
    const image = a.image ?? p.image ?? {};
    const url = image?.url ?? image?.data?.attributes?.url ?? '';
    const alt = image?.alternativeText ?? image?.data?.attributes?.alternativeText ?? a.title ?? 'Producto';

    // cat: puede llegar 'BEBIDAS-CALIENTES' o 'SNACKS' -> normalizamos a slug
    const catRaw: string = a.category ?? a?.category?.data?.attributes?.slug ?? '';
    const catSlug = toSlug(catRaw.replace(/_/g, '-'));

    return {
      id: p?.id ?? a?.id,
      title: a.title ?? 'Sin título',
      slug: a.slug ?? '',
      description: a.description ?? '',
      price: Number(a.price ?? 0),
      isPopular: Boolean(a.is_popular),
      catSlug,
      imageUrl: toAbs(STRAPI_URL, url),
      imageAlt: alt,
    };
  });

  return { title, subtitle, products };
}

export async function getMenu(): Promise<MenuPayload> {
  const json = await sfetch<any>('/api/menu');
  return normalizeMenu(json);
}