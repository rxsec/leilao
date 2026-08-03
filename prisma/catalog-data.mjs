const categoryCatalog = [
  {
    name: "Celulares",
    slug: "celulares",
    type: "electronics",
    locations: [
      ["São Paulo", "SP"],
      ["Campinas", "SP"],
      ["Curitiba", "PR"],
      ["Belo Horizonte", "MG"],
    ],
    items: [
      ["Apple iPhone 16 128GB", 5799],
      ["Apple iPhone 15 128GB", 4699],
      ["Samsung Galaxy S24 256GB", 4299],
      ["Samsung Galaxy A56 5G 256GB", 2599],
      ["Motorola Edge 50 Pro 256GB", 2999],
      ["Motorola Razr 50 256GB", 4499],
      ["Xiaomi Redmi Note 14 Pro 256GB", 2399],
      ["POCO X7 Pro 256GB", 2599],
      ["Apple iPhone 14 128GB", 3999],
      ["Samsung Galaxy Z Flip6 256GB", 6599],
    ],
  },
  {
    name: "Televisores",
    slug: "televisores",
    type: "electronics",
    locations: [
      ["São Paulo", "SP"],
      ["Rio de Janeiro", "RJ"],
      ["Curitiba", "PR"],
      ["Goiânia", "GO"],
    ],
    items: [
      ['Samsung Smart TV Crystal 55" 4K', 2999],
      ['LG UHD AI 50" 4K', 2599],
      ['TCL Google TV 65" 4K', 3899],
      ['Philips Ambilight 55" 4K', 3599],
      ['Philco Roku TV 43" Full HD', 1799],
      ['Samsung The Frame 55" QLED', 6999],
      ['LG OLED evo 55" C4', 7999],
      ['TCL QLED 50" C655', 2799],
      ['AOC Roku TV 50" 4K', 2199],
      ['Hisense Mini LED 65" 4K', 5299],
    ],
  },
  {
    name: "Eletrodomésticos",
    slug: "eletrodomesticos",
    type: "electronics",
    locations: [
      ["Guarulhos", "SP"],
      ["Osasco", "SP"],
      ["Belo Horizonte", "MG"],
      ["Recife", "PE"],
    ],
    items: [
      ["Geladeira Brastemp Frost Free 375L", 3999],
      ["Geladeira Electrolux Duplex 431L", 4599],
      ["Lavadora Electrolux 11kg", 2299],
      ["Lava e Seca Samsung 11kg", 4299],
      ["Micro-ondas Panasonic 34L", 999],
      ["Fogão Consul 5 bocas", 1899],
      ["Cooktop Brastemp 5 bocas", 1399],
      ["Lava-louças Brastemp 14 serviços", 3899],
      ["Forno elétrico Fischer 44L", 1299],
      ["Aspirador vertical Electrolux", 1599],
    ],
  },
  {
    name: "Ar condicionado",
    slug: "ar-condicionado",
    type: "electronics",
    locations: [
      ["Salvador", "BA"],
      ["Fortaleza", "CE"],
      ["Campinas", "SP"],
      ["Ribeirão Preto", "SP"],
    ],
    items: [
      ["Split Inverter LG Dual Voice 9000 BTUs", 2299],
      ["Split Inverter Samsung WindFree 12000 BTUs", 2999],
      ["Split Springer Midea Xtreme Save 9000 BTUs", 1999],
      ["Split Electrolux Color Adapt 12000 BTUs", 2799],
      ["Split Gree G-Top Auto 18000 BTUs", 3699],
      ["Ar-Condicionado Portátil Philco 12000 BTUs", 2499],
      ["Split Daikin Ecoswing 18000 BTUs", 4599],
      ["Split Elgin Eco Inverter 9000 BTUs", 1899],
      ["Cassete Carrier 24000 BTUs", 6299],
      ["Split Fujitsu Inverter 12000 BTUs", 3999],
    ],
  },
  {
    name: "Notebooks",
    slug: "notebooks",
    type: "electronics",
    locations: [
      ["São Paulo", "SP"],
      ["Curitiba", "PR"],
      ["Florianópolis", "SC"],
      ["Campinas", "SP"],
    ],
    items: [
      ["Dell Inspiron 15 i5 16GB 512GB SSD", 4299],
      ["Lenovo IdeaPad 1 Ryzen 7 512GB SSD", 3599],
      ["Samsung Galaxy Book4 i5 512GB", 3999],
      ["Asus Vivobook 15 Ryzen 5 512GB", 3199],
      ["Acer Aspire 5 i7 512GB SSD", 4499],
      ["HP 256 G9 i5 256GB SSD", 2999],
      ["MacBook Air M2 13\" 256GB", 7999],
      ["Lenovo Yoga Slim 6 i7 512GB", 5899],
      ["Dell Vostro 3510 i5 512GB", 3899],
      ["Asus Zenbook 14 OLED", 6499],
    ],
  },
  {
    name: "Computadores (Gamer)",
    slug: "computadores-gamer",
    type: "electronics",
    locations: [
      ["São Paulo", "SP"],
      ["Curitiba", "PR"],
      ["Goiânia", "GO"],
      ["Belo Horizonte", "MG"],
    ],
    items: [
      ["PC Gamer Ryzen 5 RTX 4060 16GB", 6999],
      ["PC Gamer Core i7 RTX 4070 32GB", 11999],
      ["PC Gamer Ryzen 7 RX 7800 XT 32GB", 10999],
      ["PC Gamer Ryzen 5 RTX 3060 16GB", 5899],
      ["PC Gamer Core i5 RTX 4060 Ti 16GB", 8199],
      ["PC Gamer Ryzen 9 RTX 4080 Super 32GB", 17999],
      ["PC Gamer Core i9 RTX 4090 64GB", 28999],
      ["PC Gamer Ryzen 7 RTX 4070 Super 32GB", 12499],
      ["PC Gamer Mini Tower RTX 4060", 6499],
      ["PC Gamer Streaming Ryzen 7 RTX 4070", 13499],
    ],
  },
  {
    name: "Outros",
    slug: "outros",
    type: "other",
    locations: [
      ["Campinas", "SP"],
      ["Brasília", "DF"],
      ["Curitiba", "PR"],
      ["Porto Alegre", "RS"],
    ],
    items: [
      ["Câmera Sony Alpha a6400", 6999],
      ["Drone DJI Mini 4K Fly More", 3299],
      ["Impressora 3D Creality Ender 3", 2399],
      ["Projetor Epson PowerLite", 3599],
      ["Bicicleta Ergométrica Kikos", 2199],
      ["Caixa de Som JBL PartyBox 710", 5299],
      ["Mesa de Poker Profissional", 1899],
      ["Console PlayStation 5 Slim", 3799],
      ["Nintendo Switch OLED", 2299],
      ["Patinete Elétrico Foston", 3199],
    ],
  },
  {
    name: "Terrenos",
    slug: "terrenos",
    type: "property",
    locations: [
      ["Atibaia", "SP"],
      ["Sorocaba", "SP"],
      ["Goiânia", "GO"],
      ["Londrina", "PR"],
    ],
    items: [
      ["Terreno plano 250m² em bairro residencial", 180000],
      ["Terreno de esquina 300m² com documentação regular", 240000],
      ["Lote urbano 360m² próximo ao centro", 320000],
      ["Área para chácara 1000m²", 210000],
      ["Terreno comercial 420m² em avenida", 480000],
      ["Terreno em condomínio fechado 450m²", 390000],
      ["Lote com vista livre 275m²", 195000],
      ["Terreno para galpão 600m²", 520000],
      ["Área residencial 500m² em expansão", 265000],
      ["Terreno premium 720m² em região nobre", 860000],
    ],
  },
  {
    name: "Imóveis",
    slug: "imoveis",
    type: "property",
    locations: [
      ["São Paulo", "SP"],
      ["Rio de Janeiro", "RJ"],
      ["Curitiba", "PR"],
      ["Belo Horizonte", "MG"],
    ],
    items: [
      ["Apartamento 2 quartos com varanda", 420000],
      ["Apartamento 3 quartos com vaga", 690000],
      ["Casa térrea 140m² em bairro fechado", 780000],
      ["Sobrado 180m² com quintal", 950000],
      ["Sala comercial 48m² mobiliada", 280000],
      ["Cobertura duplex 210m²", 1450000],
      ["Casa em condomínio 220m²", 1280000],
      ["Loja de rua 75m²", 390000],
      ["Studio mobiliado 32m²", 340000],
      ["Galpão logístico 600m²", 1850000],
    ],
  },
  {
    name: "Relógios",
    slug: "relogios",
    type: "luxury",
    locations: [
      ["São Paulo", "SP"],
      ["Rio de Janeiro", "RJ"],
      ["Curitiba", "PR"],
      ["Brasília", "DF"],
    ],
    items: [
      ["Rolex Datejust 41 aço e ouro", 92000],
      ["Omega Seamaster Diver 300M", 43000],
      ["TAG Heuer Carrera Chronograph", 38500],
      ["Tissot PRX Powermatic 80", 5600],
      ["Breitling Superocean 42", 29800],
      ["Longines HydroConquest 41", 12800],
      ["Hamilton Khaki Field Auto", 6900],
      ["Cartier Santos Dumont Large", 48500],
      ["Seiko Prospex Diver Automatic", 7900],
      ["Panerai Luminor Base Logo", 47500],
    ],
  },
  {
    name: "Joias",
    slug: "joias",
    type: "luxury",
    locations: [
      ["São Paulo", "SP"],
      ["Curitiba", "PR"],
      ["Florianópolis", "SC"],
      ["Belo Horizonte", "MG"],
    ],
    items: [
      ["Anel solitário ouro 18k com diamante", 12800],
      ["Colar ouro amarelo 18k com pingente", 7600],
      ["Bracelete rígido ouro rosé 18k", 15800],
      ["Par de brincos com safiras e diamantes", 9800],
      ["Corrente Cartier ouro 18k", 22400],
      ["Pulseira riviera com zircônias premium", 6900],
      ["Anel de formatura ouro 18k", 4200],
      ["Pingente gota com esmeralda", 8500],
      ["Conjunto de joias com pérolas", 11900],
      ["Aliança anatômica ouro branco 18k", 5100],
    ],
  },
  {
    name: "Artigo de Luxos",
    slug: "artigos-de-luxo",
    type: "luxury",
    locations: [
      ["São Paulo", "SP"],
      ["Rio de Janeiro", "RJ"],
      ["Curitiba", "PR"],
      ["Belo Horizonte", "MG"],
    ],
    items: [
      ["Bolsa Louis Vuitton Neverfull MM", 14800],
      ["Mala Rimowa Cabin S alumínio", 11800],
      ["Caneta Montblanc Meisterstück Classique", 3800],
      ["Óculos de sol Prada Symbole", 2600],
      ["Tênis Gucci Ace couro", 5400],
      ["Bolsa Chanel WOC couro", 27500],
      ["Cachecol Burberry em cashmere", 3200],
      ["Carteira Saint Laurent monograma", 4100],
      ["Mocassim Tod's Driver", 4500],
      ["Mala Tumi Alpha 3 International", 6900],
    ],
  },
];

export function buildCatalogSeed() {
  return categoryCatalog.map((category) => ({
    ...category,
    imageBasePath: `/catalog/${category.slug}`,
    products: category.items.map(([title, marketPrice], index) => {
      const [city, state] = category.locations[index % category.locations.length];
      const slug = slugify(title);
      const openingBid = roundCurrency(marketPrice * 0.3);
      const auctionValue = roundCurrency(marketPrice * 0.5);

      return {
        title,
        slug,
        city,
        state,
        marketPrice,
        openingBid,
        auctionValue,
        minIncrement: computeIncrement(openingBid),
        bidCount: (index % 7) + 2,
        isFeatured: index < 2,
        description: buildDescription(category.slug, title, marketPrice, auctionValue),
        endsAt: new Date(Date.now() + (index + 2) * 12 * 60 * 60 * 1000),
        imageUrl: `/catalog/${category.slug}/1.jpg`,
        gallery: [
          `/catalog/${category.slug}/1.jpg`,
          `/catalog/${category.slug}/2.jpg`,
          `/catalog/${category.slug}/3.jpg`,
        ],
      };
    }),
  }));
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function computeIncrement(value) {
  if (value >= 300000) return 5000;
  if (value >= 80000) return 2500;
  if (value >= 20000) return 1000;
  if (value >= 5000) return 250;
  return 100;
}

function buildDescription(categorySlug, title, marketPrice, auctionValue) {
  const formattedMarketValue = formatCurrency(marketPrice);
  const formattedAuctionValue = formatCurrency(auctionValue);

  const baseByCategory = {
    celulares:
      "Smartphone com boa liquidez no varejo, procura alta e conjunto equilibrado para uso pessoal ou revenda.",
    televisores:
      "Televisor com perfil doméstico e ótima atratividade para salas, quartos premium ou revenda com giro rápido.",
    eletrodomesticos:
      "Eletrodoméstico de uso recorrente, ideal para equipar residência ou compor estoque de oportunidade.",
    "ar-condicionado":
      "Equipamento buscado em regiões quentes, com apelo comercial claro para uso residencial ou corporativo.",
    notebooks:
      "Notebook com perfil versátil para trabalho, estudos e produtividade, com demanda estável no mercado.",
    "computadores-gamer":
      "Computador gamer com foco em desempenho, setup atualizado e excelente percepção de valor no público entusiasta.",
    outros:
      "Item especial com apelo próprio de categoria, boa oportunidade para uso final ou revenda com margem.",
    terrenos:
      "Terreno com documentação e metragem atrativas, indicado para construção, renda futura ou diversificação patrimonial.",
    imoveis:
      "Imóvel com características comerciais sólidas, potencial de ocupação e boa relação entre localização e liquidez.",
    relogios:
      "Relógio com forte apelo de coleção e presente, categoria tradicional em leilões de alto valor.",
    joias:
      "Joia com composição valorizada e excelente percepção de exclusividade, ideal para coleção ou revenda selecionada.",
    "artigos-de-luxo":
      "Artigo de luxo com marca reconhecida, alto valor percebido e boa atratividade para compradores exigentes.",
  };

  return `${title}. ${baseByCategory[categorySlug]} Valor de mercado de referência estimado em ${formattedMarketValue}, com projeção de arremate em torno de ${formattedAuctionValue}.`;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
