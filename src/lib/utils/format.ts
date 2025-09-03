export const fmtCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0);

export const toSlug = (v?: string | null) =>
  (v ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

export const titleCase = (v: string) =>
  v.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

export const toAbs = (baseUrl: string, u?: string | null) =>
  !u ? '' : u.startsWith('http') ? u : `${baseUrl}${u}`;