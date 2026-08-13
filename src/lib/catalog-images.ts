const fallbackCategoryGallery: Record<string, string[]> = {
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

const curatedCategoryImageBySlug: Record<string, string> = {
  celulares: "/catalog-featured/apple-iphone-16-128gb-white.png",
  televisores: "/catalog-featured/samsung-smart-tv-crystal-55-4k.jpg",
  eletrodomesticos: "/catalog-featured/geladeira-brastemp-frost-free-375l.jpg",
  "ar-condicionado": "/catalog-featured/split-inverter-lg-dual-voice-9000-btus.jpg",
  notebooks: "/produtos/notebooks/macbook-pro-13-apple-mwp42bza-cinza-espacial-intel-core-i5-1038ng7-ram-16gb-ssd-512gb-macos.jpg",
  "computadores-gamer": "/produtos/computadores-gamer/draven-completo-fundo-branco-ijyhk_640x640+fill_ffffff.jpg",
  outros: "/catalog-featured/console-playstation-5-slim.jpg",
  terrenos: "/produtos/categorias/pelotas-terreno-condominio-sao-goncalo-19-07-2024_17-20-45-0.webp",
  imoveis: "/produtos/categorias/imsasasasaages.jpeg",
  relogios: "/catalog-featured/rolex-datejust-41-aco-e-ouro.png",
  joias: "/produtos/categorias/imsasasasaages.jpeg",
  "artigos-de-luxo": "/produtos/categorias/bolsa_louis_vuitton_onthego_mm_monograma_15043_1_36a573064ecf917cabd86e751d63b9f3.webp",
};

const curatedLotGalleryBySlug: Record<string, string[]> = {
  "apple-iphone-16-128gb": [
    "/catalog-featured/apple-iphone-16-128gb-white.png",
    "/catalog-featured/apple-iphone-16-128gb.jpg",
    "/catalog-featured/apple-iphone-16-128gb-white.png",
  ],
  "apple-iphone-15-128gb": [
    "/catalog-featured/apple-iphone-15-128gb.png",
  ],
  "apple-iphone-14-128gb": [
    "/catalog-featured/apple-iphone-14-128gb.png",
  ],
  "samsung-smart-tv-crystal-55-4k": [
    "/catalog-featured/samsung-smart-tv-crystal-55-4k.jpg",
  ],
  "geladeira-brastemp-frost-free-375l": [
    "/catalog-featured/geladeira-brastemp-frost-free-375l.jpg",
  ],
  "split-inverter-lg-dual-voice-9000-btus": [
    "/catalog-featured/split-inverter-lg-dual-voice-9000-btus.jpg",
  ],
  "camera-sony-alpha-a6400": [
    "/catalog-featured/camera-sony-alpha-a6400.webp",
  ],
  "drone-dji-mini-4k-fly-more": [
    "/catalog-featured/drone-dji-mini-4k-fly-more.png",
  ],
  "console-playstation-5-slim": [
    "/catalog-featured/console-playstation-5-slim.jpg",
  ],
  "nintendo-switch-oled": [
    "/catalog-featured/nintendo-switch-oled.jpg",
  ],
  "macbook-air-m2-13-256gb": [
    "/catalog-featured/macbook-air-m2-13-256gb.jpg",
  ],
  "asus-vivobook-15-ryzen-5-512gb": [
    "/catalog-featured/asus-vivobook-15-ryzen-5-512gb.jpg",
  ],
  "pc-gamer-ryzen-5-rtx-4060-16gb": [
    "/catalog-featured/pc-gamer-ryzen-5-rtx-4060-16gb.jpg",
  ],
  "rolex-datejust-41-aco-e-ouro": [
    "/catalog-featured/rolex-datejust-41-aco-e-ouro.png",
  ],
  "anel-solitario-ouro-18k-com-diamante": [
    "/catalog-featured/anel-solitario-ouro-18k-com-diamante.png",
  ],
  "bolsa-louis-vuitton-neverfull-mm": [
    "/catalog-featured/bolsa-louis-vuitton-neverfull-mm.jpg",
  ],
};

export const featuredHomeLotSlugs = [
  "apple-iphone-16-128gb",
  "samsung-smart-tv-crystal-55-4k",
  "geladeira-brastemp-frost-free-375l",
  "split-inverter-lg-dual-voice-9000-btus",
  "camera-sony-alpha-a6400",
  "rolex-datejust-41-aco-e-ouro",
];

export const featuredPremiumLotSlugs = [
  "apple-iphone-16-128gb",
  "apple-iphone-15-128gb",
  "macbook-air-m2-13-256gb",
  "camera-sony-alpha-a6400",
  "console-playstation-5-slim",
  "nintendo-switch-oled",
  "drone-dji-mini-4k-fly-more",
];

export function getCategoryImage(slug: string) {
  return curatedCategoryImageBySlug[slug] ?? fallbackCategoryGallery[slug]?.[0] ?? "/catalog/outros/1.jpg";
}

export function getCategoryGallery(slug: string) {
  return fallbackCategoryGallery[slug] ?? fallbackCategoryGallery.outros;
}

export function getLotGallery(categorySlug: string, lotSlug: string) {
  if (curatedLotGalleryBySlug[lotSlug]) {
    return curatedLotGalleryBySlug[lotSlug];
  }

  const gallery = getCategoryGallery(categorySlug);
  const startIndex = Math.abs(hashValue(lotSlug)) % gallery.length;

  return gallery.map((_, index) => gallery[(startIndex + index) % gallery.length]);
}

export function getLotCoverImage(categorySlug: string, lotSlug: string) {
  return getLotGallery(categorySlug, lotSlug)[0];
}

function hashValue(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return hash;
}
