require('../config/env');
const pool = require('../config/db');

// All image URLs use Unsplash direct photo links (format: /photo-{id}?w=500&q=80)
// These are permanently hosted, no auth required, no hotlink blocking.
const products = [

  // ── Mobiles ──────────────────────────────────────────────────────────────────
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: '6.8-inch QHD+ Dynamic AMOLED display, 200MP camera, Snapdragon 8 Gen 3, 5000mAh battery with 45W fast charging.',
    price: 129999, discount_price: 114999,
    category: 'Mobiles', brand: 'Samsung', stock: 40,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
    ],
  },
  {
    name: 'Apple iPhone 15 Pro',
    description: 'A17 Pro chip, 48MP main camera with 5x optical zoom, titanium design, USB-C with USB 3 speeds.',
    price: 134900, discount_price: 124900,
    category: 'Mobiles', brand: 'Apple', stock: 35,
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80',
      'https://images.unsplash.com/photo-1574755393849-623942496936?w=500&q=80',
    ],
  },
  {
    name: 'OnePlus 12R',
    description: 'Snapdragon 8 Gen 1, 6.78-inch AMOLED 120Hz display, 50MP triple camera, 100W SUPERVOOC charging.',
    price: 39999, discount_price: 36999,
    category: 'Mobiles', brand: 'OnePlus', stock: 60,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
      'https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=500&q=80',
      'https://images.unsplash.com/photo-1581993192873-57965b5c3b38?w=500&q=80',
    ],
  },
  {
    name: 'Redmi Note 13 Pro+',
    description: '200MP triple camera, 6.67-inch AMOLED curved display, 120W HyperCharge, IP68 water resistance.',
    price: 31999, discount_price: 28999,
    category: 'Mobiles', brand: 'Xiaomi', stock: 75,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80',
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80',
    ],
  },

  // ── Laptops ───────────────────────────────────────────────────────────────────
  {
    name: 'Apple MacBook Air M3',
    description: '13.6-inch Liquid Retina display, Apple M3 chip, 8GB RAM, 256GB SSD, up to 18 hours battery life.',
    price: 114900, discount_price: 109900,
    category: 'Laptops', brand: 'Apple', stock: 25,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      'https://images.unsplash.com/photo-1611186871525-9a4b9e2a8f42?w=500&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
    ],
  },
  {
    name: 'Dell XPS 15',
    description: '15.6-inch OLED touch, Intel Core i7-13700H, 16GB DDR5 RAM, 512GB NVMe SSD, NVIDIA RTX 4060.',
    price: 179990, discount_price: 164990,
    category: 'Laptops', brand: 'Dell', stock: 18,
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80',
    ],
  },
  {
    name: 'HP Pavilion 15',
    description: 'AMD Ryzen 5 7520U, 15.6-inch FHD display, 16GB RAM, 512GB SSD, Windows 11 Home.',
    price: 62990, discount_price: 54990,
    category: 'Laptops', brand: 'HP', stock: 45,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
      'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=500&q=80',
      'https://images.unsplash.com/photo-1526657782461-9fe13402a841?w=500&q=80',
    ],
  },

  // ── Televisions ───────────────────────────────────────────────────────────────
  {
    name: 'Sony Bravia 55" OLED 4K',
    description: '55-inch OLED 4K UHD, XR Cognitive Processor, Dolby Vision & Atmos, Google TV, 120Hz panel.',
    price: 179990, discount_price: 149990,
    category: 'Televisions', brand: 'Sony', stock: 15,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
      'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=500&q=80',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&q=80',
    ],
  },
  {
    name: 'LG 43" 4K Smart TV',
    description: '43-inch 4K UHD LED, α5 AI Processor Gen6, webOS 23, ThinQ AI, HDR10 Pro, built-in Alexa.',
    price: 42990, discount_price: 34990,
    category: 'Televisions', brand: 'LG', stock: 30,
    images: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&q=80',
      'https://images.unsplash.com/photo-1615655096345-61a54750068d?w=500&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    ],
  },

  // ── Audio ─────────────────────────────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation, 30-hour battery, Hi-Res Audio, multipoint connection.',
    price: 29990, discount_price: 24990,
    category: 'Audio', brand: 'Sony', stock: 55,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
    ],
  },
  {
    name: 'Apple AirPods Pro 2nd Gen',
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalised Spatial Audio, H2 chip.',
    price: 24900, discount_price: 22900,
    category: 'Audio', brand: 'Apple', stock: 50,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80',
      'https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=500&q=80',
      'https://images.unsplash.com/photo-1631867675167-90a456a90863?w=500&q=80',
    ],
  },
  {
    name: 'JBL Flip 6',
    description: 'Powerful JBL Pro Sound, IP67 waterproof, 12-hour playtime, PartyBoost, bold fabric design.',
    price: 9999, discount_price: 7999,
    category: 'Audio', brand: 'JBL', stock: 90,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    ],
  },

  // ── Cameras ───────────────────────────────────────────────────────────────────
  {
    name: 'Canon EOS R50',
    description: '24.2MP APS-C sensor, 4K video, Dual Pixel CMOS AF II, compact mirrorless, Wi-Fi & Bluetooth.',
    price: 79995, discount_price: 72995,
    category: 'Cameras', brand: 'Canon', stock: 20,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
      'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=500&q=80',
      'https://images.unsplash.com/photo-1606986628253-50a37e23c67b?w=500&q=80',
    ],
  },
  {
    name: 'GoPro HERO 12 Black',
    description: '5.3K video, HyperSmooth 6.0 stabilisation, 27MP photos, HDR video, waterproof to 10m.',
    price: 44500, discount_price: 39500,
    category: 'Cameras', brand: 'GoPro', stock: 35,
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
      'https://images.unsplash.com/photo-1560759226-14da22a643ef?w=500&q=80',
      'https://images.unsplash.com/photo-1625502513989-bc0955ce51b1?w=500&q=80',
    ],
  },

  // ── Appliances ────────────────────────────────────────────────────────────────
  {
    name: 'LG 7 kg Front Load Washing Machine',
    description: 'AI DD technology, 6 Motion Direct Drive, Steam wash, TurboWash, energy rating 5 star.',
    price: 54990, discount_price: 42990,
    category: 'Appliances', brand: 'LG', stock: 22,
    images: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1a9a8842?w=500&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&q=80',
    ],
  },
  {
    name: 'Dyson V15 Detect',
    description: 'Laser detects invisible dust, HEPA filtration, 60-minute runtime, LCD shows particle count.',
    price: 62900, discount_price: 54900,
    category: 'Appliances', brand: 'Dyson', stock: 18,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94ebb81f4?w=500&q=80',
    ],
  },

  // ── Fashion ───────────────────────────────────────────────────────────────────
  {
    name: 'Nike Air Max 270',
    description: 'Lightweight mesh upper, Max Air 270 unit for all-day comfort, foam midsole, rubber outsole.',
    price: 12995, discount_price: 9995,
    category: 'Fashion', brand: 'Nike', stock: 100,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    ],
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: 'Slim through seat and thigh, straight leg opening, sits below waist, 99% cotton 1% elastane.',
    price: 3999, discount_price: 2799,
    category: 'Fashion', brand: "Levi's", stock: 150,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&q=80',
    ],
  },

  // ── Books ─────────────────────────────────────────────────────────────────────
  {
    name: 'Atomic Habits — James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Over 10 million copies sold.',
    price: 799, discount_price: 499,
    category: 'Books', brand: 'Penguin', stock: 200,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
    ],
  },
  {
    name: 'The Pragmatic Programmer',
    description: '20th Anniversary Edition. From journeyman to master — timeless advice for every developer.',
    price: 2999, discount_price: 1999,
    category: 'Books', brand: 'Addison-Wesley', stock: 120,
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
    ],
  },
];

// ── Seeder ─────────────────────────────────────────────────────────────────────
async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let inserted = 0;
    for (const p of products) {
      const [result] = await conn.query(
        `INSERT INTO products
           (name, description, price, discount_price, category, brand, stock)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.price, p.discount_price ?? null, p.category, p.brand, p.stock]
      );
      const productId = result.insertId;

      const imageRows = p.images.map((url, idx) => [productId, url, idx]);
      await conn.query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?',
        [imageRows]
      );

      inserted++;
      console.log(`  ✓ [${p.category}] ${p.name}`);
    }

    await conn.commit();
    console.log(`\nSeeded ${inserted} products successfully.`);
  } catch (err) {
    await conn.rollback();
    console.error('Seed failed, rolled back:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
