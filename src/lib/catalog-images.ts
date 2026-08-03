const catalogImageBySlug: Record<string, string[]> = {
  celulares: [
    "/catalog/celulares/1.jpg",
    "/catalog/celulares/2.jpg",
    "/catalog/celulares/3.jpg",
  ],
  televisores: [
    "/catalog/televisores/1.jpg",
    "/catalog/televisores/2.jpg",
    "/catalog/televisores/3.jpg",
  ],
  eletrodomesticos: [
    "/catalog/eletrodomesticos/1.jpg",
    "/catalog/eletrodomesticos/2.jpg",
    "/catalog/eletrodomesticos/3.jpg",
  ],
  "ar-condicionado": [
    "/catalog/ar-condicionado/1.jpg",
    "/catalog/ar-condicionado/2.jpg",
    "/catalog/ar-condicionado/3.jpg",
  ],
  notebooks: [
    "/catalog/notebooks/1.jpg",
    "/catalog/notebooks/2.jpg",
    "/catalog/notebooks/3.jpg",
  ],
  "computadores-gamer": [
    "/catalog/computadores-gamer/1.jpg",
    "/catalog/computadores-gamer/2.jpg",
    "/catalog/computadores-gamer/3.jpg",
  ],
  outros: [
    "/catalog/outros/1.jpg",
    "/catalog/outros/2.jpg",
    "/catalog/outros/3.jpg",
  ],
  terrenos: [
    "/catalog/terrenos/1.jpg",
    "/catalog/terrenos/2.jpg",
    "/catalog/terrenos/3.jpg",
  ],
  imoveis: [
    "/catalog/imoveis/1.jpg",
    "/catalog/imoveis/2.jpg",
    "/catalog/imoveis/3.jpg",
  ],
  relogios: [
    "/catalog/relogios/1.jpg",
    "/catalog/relogios/2.jpg",
    "/catalog/relogios/3.jpg",
  ],
  joias: [
    "/catalog/joias/1.jpg",
    "/catalog/joias/2.jpg",
    "/catalog/joias/3.jpg",
  ],
  "artigos-de-luxo": [
    "/catalog/artigos-de-luxo/1.jpg",
    "/catalog/artigos-de-luxo/2.jpg",
    "/catalog/artigos-de-luxo/3.jpg",
  ],
};

export function getCategoryImage(slug: string) {
  return catalogImageBySlug[slug]?.[0] ?? "/catalog/outros/1.jpg";
}

export function getCategoryGallery(slug: string) {
  return catalogImageBySlug[slug] ?? catalogImageBySlug.outros;
}

export function getLotGallery(slug: string, lotKey: string) {
  const gallery = getCategoryGallery(slug);
  const startIndex = Math.abs(hashValue(lotKey)) % gallery.length;

  return gallery.map((_, index) => gallery[(startIndex + index) % gallery.length]);
}

export function getLotCoverImage(slug: string, lotKey: string) {
  return getLotGallery(slug, lotKey)[0];
}

function hashValue(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return hash;
}
