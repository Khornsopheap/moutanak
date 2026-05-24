import { 
  SellerRequest, 
  Seller, 
  Product, 
  Order, 
  User, 
  Review, 
  PaymentPayout, 
  Transaction, 
  PlatformConfig 
} from './types';

// -------------------------------------------------------------
// SEED DATA
// -------------------------------------------------------------

const INITIAL_SELLER_REQUESTS: SellerRequest[] = [
  {
    id: 'S001',
    fn: 'Vanna Sok',
    em: 'vanna@farm.kh',
    ph: '012345678',
    dob: '1988-04-12',
    sn: "Vanna's Spicy Farm",
    cat: 'Vegetables & Herbs',
    prov: 'Kampot',
    tin: 'K000-123456',
    breg: '',
    stk: '200–500 kg',
    aba: '0001234',
    abn: 'Vanna Sok',
    wing: '',
    desc: 'Family-run organic spice farm in Kampot, specialising in pepper and chilli.',
    fb: 'https://facebook.com/vannasfarm',
    st: 'pending',
    sub: '2026-05-18T08:22:00Z',
    docs: [
      { t: 'id_front', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { t: 'id_back', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { t: 'selfie', s: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400' },
      { t: 'store_photo', s: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400' },
      { t: 'farm_photo', s: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400' },
      { t: 'product_photo', s: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' }
    ],
    _src: 'seed'
  },
  {
    id: 'S002',
    fn: 'Dara Chhan',
    em: 'dara@weave.kh',
    ph: '098765432',
    dob: '1992-07-30',
    sn: 'The Khmer Weaver',
    cat: 'Artisan Crafts',
    prov: 'Takeo',
    tin: 'K000-654321',
    breg: '00-001234-MOC',
    stk: '50–200 kg',
    aba: '',
    abn: '',
    wing: '098765432',
    desc: 'Traditional Khmer silk weaving cooperative, 3rd generation artisans.',
    fb: '',
    st: 'pending',
    sub: '2026-05-18T11:10:00Z',
    docs: [
      { t: 'id_front', s: 'https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=400' },
      { t: 'selfie', s: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400' },
      { t: 'store_photo', s: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400' },
      { t: 'product_photo', s: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400' }
    ],
    _src: 'seed'
  },
  {
    id: 'S003',
    fn: 'Lyna Pech',
    em: 'lyna@jasmine.kh',
    ph: '077111222',
    dob: '1985-01-15',
    sn: 'Gold Jasmine Coop',
    cat: 'Grains & Spices',
    prov: 'Battambang',
    tin: 'K000-777888',
    breg: '00-009876-MOC',
    stk: 'More than 1 tonne',
    aba: '0007770',
    abn: 'Lyna Pech',
    wing: '',
    desc: 'Rice cooperative supplying premium jasmine rice to Phnom Penh and Siem Reap.',
    fb: 'https://facebook.com/goldjasmine',
    st: 'pending',
    sub: '2026-05-17T09:00:00Z',
    docs: [
      { t: 'id_front', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { t: 'id_back', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { t: 'selfie', s: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
      { t: 'store_photo', s: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400' },
      { t: 'farm_photo', s: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400' },
      { t: 'product_photo', s: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9e9b7?w=400' }
    ],
    _src: 'seed'
  },
  {
    id: 'S004',
    fn: 'Rith Panha',
    em: 'rith@kampong.kh',
    ph: '012999888',
    dob: '1995-11-05',
    sn: 'Kampong Fresh',
    cat: 'Fruits',
    prov: 'Kampong Cham',
    tin: 'K000-001122',
    breg: '',
    stk: '50–200 kg',
    aba: '',
    abn: '',
    wing: '012999888',
    desc: 'Fresh tropical fruits harvested daily from family orchards in Kampong Cham.',
    fb: '',
    st: 'approved',
    sub: '2026-05-16T08:00:00Z',
    rev: '2026-05-16T12:00:00Z',
    note: 'All documents verified. Welcome to Moutanak!',
    docs: [
      { t: 'id_front', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { t: 'id_back', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { t: 'selfie', s: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400' },
      { t: 'store_photo', s: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400' },
      { t: 'farm_photo', s: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400' }
    ],
    _src: 'seed'
  },
  {
    id: 'S005',
    fn: 'Mony Keo',
    em: 'mony@sea.kh',
    ph: '099334455',
    dob: '1990-03-22',
    sn: 'Coastal Catch Co.',
    cat: 'Seafood & Fish',
    prov: 'Sihanoukville',
    tin: 'K000-998877',
    breg: '',
    stk: '500kg–1tonne',
    aba: '0009988',
    abn: 'Mony Keo',
    wing: '',
    desc: 'Daily fresh seafood from local Sihanoukville fishermen.',
    fb: '',
    st: 'rejected',
    sub: '2026-05-15T07:00:00Z',
    rev: '2026-05-15T14:00:00Z',
    note: 'TIN certificate image too blurry to verify. Please resubmit a clear scan.',
    docs: [
      { t: 'id_front', s: 'https://images.unsplash.com/photo-1642615703316-e3c29bbb0deb?w=400' },
      { d: 'id_back', s: null }
    ] as any,
    _src: 'seed'
  }
];

const INITIAL_SELLERS: Seller[] = [
  {
    id: 'SEL001',
    name: 'Rith Panha',
    storeName: 'Kampong Fresh',
    email: 'rith@kampong.kh',
    phone: '012999888',
    category: 'Fruits',
    province: 'Kampong Cham',
    tin: 'K000-001122',
    joinedDate: '2026-05-16',
    status: 'active',
    totalProducts: 4,
    totalSales: 1680,
    rating: 4.8
  },
  {
    id: 'SEL002',
    name: 'Sovann Vora',
    storeName: 'Angkor Pottery',
    email: 'sovann@pottery.kh',
    phone: '015443322',
    category: 'Artisan Crafts',
    province: 'Siem Reap',
    tin: 'K000-884422',
    joinedDate: '2026-04-10',
    status: 'active',
    totalProducts: 12,
    totalSales: 540,
    rating: 4.9
  },
  {
    id: 'SEL003',
    name: 'Sophy Noun',
    storeName: 'Mekong Honey',
    email: 'sophy@honey.kh',
    phone: '077665544',
    category: 'Vegetables & Herbs',
    province: 'Kandal',
    tin: 'K000-117766',
    joinedDate: '2026-03-05',
    status: 'active',
    totalProducts: 2,
    totalSales: 890,
    rating: 4.6
  },
  {
    id: 'SEL004',
    name: 'Kosal Seng',
    storeName: 'Preah Vihear Stevia',
    email: 'kosal@stevia.kh',
    phone: '093223344',
    category: 'Grains & Spices',
    province: 'Preah Vihear',
    tin: 'K000-112299',
    joinedDate: '2026-02-14',
    status: 'suspended',
    totalProducts: 3,
    totalSales: 110,
    rating: 3.2
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    name: 'Kampot Pepper (Premium Black) 500g',
    sku: 'SKU-00121',
    sellerName: "Vanna's Spicy Farm",
    category: 'Spices',
    price: 12.50,
    stock: 420,
    salesCount: 310,
    status: 'active',
    imageAlt: 'Premium Pepper',
    imageColor: 'bg-zinc-800'
  },
  {
    id: 'PROD-002',
    name: 'Khmer Handwoven Silk Scarf',
    sku: 'SKU-00088',
    sellerName: 'The Khmer Weaver',
    category: 'Crafts',
    price: 38.00,
    stock: 85,
    salesCount: 42,
    status: 'active',
    imageAlt: 'Silk Scarf',
    imageColor: 'bg-orange-600'
  },
  {
    id: 'PROD-003',
    name: 'Phka Rumduol Jasmine Rice 5kg',
    sku: 'SKU-00204',
    sellerName: 'Gold Jasmine Coop',
    category: 'Grains',
    price: 9.80,
    stock: 1200,
    salesCount: 840,
    status: 'active',
    imageAlt: 'Jasmine Rice',
    imageColor: 'bg-emerald-100'
  },
  {
    id: 'PROD-004',
    name: 'Organic Chewy Dried Mango 250g',
    sku: 'SKU-00302',
    sellerName: 'Kampong Fresh',
    category: 'Fruits',
    price: 6.50,
    stock: 18,
    salesCount: 95,
    status: 'low_stock',
    imageAlt: 'Dried Mango',
    imageColor: 'bg-amber-400'
  },
  {
    id: 'PROD-005',
    name: 'Natural Forest Honey 700ml',
    sku: 'SKU-00412',
    sellerName: 'Mekong Honey',
    category: 'Spices',
    price: 24.00,
    stock: 0,
    salesCount: 152,
    status: 'out_of_stock',
    imageAlt: 'Forest Honey',
    imageColor: 'bg-amber-600'
  },
  {
    id: 'PROD-006',
    name: 'Traditional Clay Water Jug (Siem Reap)',
    sku: 'SKU-00551',
    sellerName: 'Angkor Pottery',
    category: 'Crafts',
    price: 15.00,
    stock: 320,
    salesCount: 110,
    status: 'active',
    imageAlt: 'Clay Jug',
    imageColor: 'bg-amber-700'
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: '10041',
    customerName: 'Lay Horn',
    phone: '012112233',
    province: 'Phnom Penh',
    itemsCount: 3,
    items: [
      { name: 'Kampot Pepper (Premium Black) 500g', price: 12.50, qty: 2 },
      { name: 'Phka Rumduol Jasmine Rice 5kg', price: 9.80, qty: 1 }
    ],
    total: 34.80,
    sellerName: "Vanna's Spicy Farm",
    date: '2026-05-19T06:14:00Z',
    status: 'Completed'
  },
  {
    id: '10042',
    customerName: 'Sok Dara',
    phone: '098445566',
    province: 'Siem Reap',
    itemsCount: 1,
    items: [
      { name: 'Khmer Handwoven Silk Scarf', price: 38.00, qty: 1 }
    ],
    total: 38.00,
    sellerName: 'The Khmer Weaver',
    date: '2026-05-20T10:11:00Z',
    status: 'Pending'
  },
  {
    id: '10043',
    customerName: 'Chan Vira',
    phone: '077990011',
    province: 'Battambang',
    itemsCount: 5,
    items: [
      { name: 'Natural Forest Honey 700ml', price: 24.00, qty: 5 }
    ],
    total: 120.00,
    sellerName: 'Mekong Honey',
    date: '2026-05-20T14:48:00Z',
    status: 'Cancelled'
  },
  {
    id: '10044',
    customerName: 'Rith Panha',
    phone: '012999888',
    province: 'Kampot',
    itemsCount: 2,
    items: [
      { name: 'Organic Chewy Dried Mango 250g', price: 6.50, qty: 2 }
    ],
    total: 13.00,
    sellerName: 'Kampong Fresh',
    date: '2026-05-20T15:20:00Z',
    status: 'Shipped'
  },
  {
    id: '10045',
    customerName: 'Bona Ouk',
    phone: '085887766',
    province: 'Phnom Penh',
    itemsCount: 4,
    items: [
      { name: 'Phka Rumduol Jasmine Rice 5kg', price: 9.80, qty: 3 },
      { name: 'Kampot Pepper (Premium Black) 500g', price: 12.50, qty: 1 }
    ],
    total: 41.90,
    sellerName: 'Gold Jasmine Coop',
    date: '2026-05-22T08:05:00Z',
    status: 'Completed'
  },
  {
    id: '10046',
    customerName: 'Phalla Keo',
    phone: '093556677',
    province: 'Kampong Cham',
    itemsCount: 2,
    items: [
      { name: 'Organic Chewy Dried Mango 250g', price: 6.50, qty: 4 }
    ],
    total: 26.00,
    sellerName: 'Kampong Fresh',
    date: '2026-05-23T11:45:00Z',
    status: 'Pending'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'USR001',
    name: 'Lay Horn',
    email: 'layhorn@moutanak.kh',
    role: 'Super Admin',
    status: 'Active',
    phone: '012112233',
    joinedDate: '2025-01-10'
  },
  {
    id: 'USR002',
    name: 'Sok Dara',
    email: 'sokdara@moutanak.kh',
    role: 'Reviewer',
    status: 'Active',
    phone: '098445566',
    joinedDate: '2025-05-02'
  },
  {
    id: 'USR003',
    name: 'Chan Vira',
    email: 'vira@moutanak.kh',
    role: 'Manager',
    status: 'Active',
    phone: '077990011',
    joinedDate: '2025-06-15'
  },
  {
    id: 'USR004',
    name: 'Mony Keo',
    email: 'keo@moutanak.kh',
    role: 'Support',
    status: 'Away',
    phone: '099334455',
    joinedDate: '2025-11-20'
  },
  {
    id: 'USR005',
    name: 'Piseth Nov',
    email: 'piseth@moutanak.kh',
    role: 'Finance',
    status: 'Active',
    phone: '015886633',
    joinedDate: '2026-01-08'
  },
  {
    id: 'USR006',
    name: 'Dany Chhim',
    email: 'dany.customer@example.com',
    role: 'Customer',
    status: 'Active',
    phone: '081223344',
    joinedDate: '2026-04-12'
  },
  {
    id: 'USR007',
    name: 'Sovanmony Rath',
    email: 'mony.customer@example.com',
    role: 'Customer',
    status: 'Suspended',
    phone: '016556677',
    joinedDate: '2026-03-24'
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'REV-001',
    productName: 'Kampot Pepper (Premium Black) 500g',
    customerName: 'Lay Horn',
    rating: 5,
    comment: 'Exceptional quality. The aroma is unbeatable. Recommended for restaurants!',
    date: '2026-05-20T08:30:00Z',
    status: 'Approved'
  },
  {
    id: 'REV-002',
    productName: 'Phka Rumduol Jasmine Rice 5kg',
    customerName: 'Dany Chhim',
    rating: 5,
    comment: 'The softest and most fragrant rice in Cambodia. Perfectly clean milling.',
    date: '2026-05-22T09:12:00Z',
    status: 'Approved'
  },
  {
    id: 'REV-003',
    productName: 'Organic Chewy Dried Mango 250g',
    customerName: 'Sovanmony Rath',
    rating: 2,
    comment: 'Way too sweet, tasted like sugar was added when they said it is 100% natural.',
    date: '2026-05-23T11:00:00Z',
    status: 'Pending'
  },
  {
    id: 'REV-004',
    productName: 'Natural Forest Honey 700ml',
    customerName: 'Sok Dara',
    rating: 4,
    comment: 'Great organic product, bottle cap was slightly loose though.',
    date: '2026-05-21T14:24:00Z',
    status: 'Approved'
  },
  {
    id: 'REV-005',
    productName: 'Traditional Clay Water Jug (Siem Reap)',
    customerName: 'Bona Ouk',
    rating: 5,
    comment: 'Splendid craftsmanship. Keeps the water beautifully cool during hot afternoons!',
    date: '2026-05-22T03:10:00Z',
    status: 'Approved'
  },
  {
    id: 'REV-006',
    productName: 'Kampot Pepper (Premium Black) 500g',
    customerName: 'Spambot Tester',
    rating: 1,
    comment: 'CLICK HERE TO GET FREE PAYPAL MONEY NOW! HTTP://SPAM-LINK.RU/FREEMONEY',
    date: '2026-05-23T16:04:00Z',
    status: 'Flagged'
  }
];

const INITIAL_PAYMENTS: PaymentPayout[] = [
  {
    id: 'PAY-1001',
    sellerName: 'Kampong Fresh',
    amount: 1450.00,
    method: 'Wing Wallet',
    accountNo: '012999888',
    accountName: 'Rith Panha',
    status: 'Completed',
    date: '2026-05-15'
  },
  {
    id: 'PAY-1002',
    sellerName: 'Angkor Pottery',
    amount: 380.00,
    method: 'ABA Bank',
    accountNo: '000112233',
    accountName: 'Sovann Vora',
    status: 'Completed',
    date: '2026-05-18'
  },
  {
    id: 'PAY-1003',
    sellerName: "Vanna's Spicy Farm",
    amount: 620.50,
    method: 'ABA Bank',
    accountNo: '333444555',
    accountName: 'Vanna Sok',
    status: 'Pending',
    date: '2026-05-23'
  },
  {
    id: 'PAY-1004',
    sellerName: 'The Khmer Weaver',
    amount: 280.00,
    method: 'Wing Wallet',
    accountNo: '098765432',
    accountName: 'Dara Chhan',
    status: 'Pending',
    date: '2026-05-23'
  },
  {
    id: 'PAY-1005',
    sellerName: 'Gold Jasmine Coop',
    amount: 1840.00,
    method: 'ACLEDA Bank',
    accountNo: '077111222-01',
    accountName: 'Lyna Pech',
    status: 'Failed',
    date: '2026-05-20'
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-00941',
    orderId: '10041',
    amount: 34.80,
    customerName: 'Lay Horn',
    type: 'Purchase',
    status: 'Success',
    method: 'ABA Bank',
    date: '2026-05-19T06:14:00Z'
  },
  {
    id: 'TXN-00942',
    orderId: '10042',
    amount: 38.00,
    customerName: 'Sok Dara',
    type: 'Purchase',
    status: 'Pending',
    method: 'Wing',
    date: '2026-05-20T10:11:00Z'
  },
  {
    id: 'TXN-00943',
    orderId: '10043',
    amount: 120.00,
    customerName: 'Chan Vira',
    type: 'Refund',
    status: 'Success',
    method: 'ACLEDA',
    date: '2026-05-21T02:00:00Z'
  },
  {
    id: 'TXN-00944',
    orderId: '10044',
    amount: 13.00,
    customerName: 'Rith Panha',
    type: 'Purchase',
    status: 'Success',
    method: 'Credit Card',
    date: '2026-05-20T15:20:00Z'
  },
  {
    id: 'TXN-00945',
    orderId: '10045',
    amount: 41.90,
    customerName: 'Bona Ouk',
    type: 'Purchase',
    status: 'Success',
    method: 'ABA Bank',
    date: '2026-05-22T08:05:00Z'
  },
  {
    id: 'TXN-00946',
    orderId: 'PAY-1001',
    amount: 1450.00,
    customerName: 'Kampong Fresh',
    type: 'Payout',
    status: 'Success',
    method: 'Wing',
    date: '2026-05-15T12:00:00Z'
  },
  {
    id: 'TXN-00947',
    orderId: 'PAY-1002',
    amount: 380.00,
    customerName: 'Angkor Pottery',
    type: 'Payout',
    status: 'Success',
    method: 'ABA Bank',
    date: '2026-05-18T12:00:00Z'
  }
];

const INITIAL_CONFIG: PlatformConfig = {
  name: 'Moutanak Commerce',
  adminEmail: 'admin@moutanak.kh',
  phone: '+855 23 000 000',
  defaultLanguage: 'English',
  commissionBase: 2.0,
  commissionVerified: 1.5,
  commissionPremium: 1.0,
  requireTin: true,
  requireSelfie: true,
  requireAddress: true,
  autoApprove: false,
  requireBizReg: true,
  notifyNewSeller: true,
  notifyApproved: true,
  notifyNewOrder: true,
  notifyLowStock: false,
  notifyDailyEmail: true
};

// -------------------------------------------------------------
// STORAGE MANAGER
// -------------------------------------------------------------

function getStoredOrInit<T>(key: string, initial: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data) as T;
}

export function saveStored<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Low-level database triggers
export const db = {
  getSellerRequests: () => getStoredOrInit<SellerRequest[]>('moutanak_seller_requests', INITIAL_SELLER_REQUESTS),
  setSellerRequests: (data: SellerRequest[]) => saveStored('moutanak_seller_requests', data),

  getSellers: () => getStoredOrInit<Seller[]>('moutanak_sellers', INITIAL_SELLERS),
  setSellers: (data: Seller[]) => saveStored('moutanak_sellers', data),

  getProducts: () => getStoredOrInit<Product[]>('moutanak_products', INITIAL_PRODUCTS),
  setProducts: (data: Product[]) => saveStored('moutanak_products', data),

  getOrders: () => getStoredOrInit<Order[]>('moutanak_orders', INITIAL_ORDERS),
  setOrders: (data: Order[]) => saveStored('moutanak_orders', data),

  getUsers: () => getStoredOrInit<User[]>('moutanak_users', INITIAL_USERS),
  setUsers: (data: User[]) => saveStored('moutanak_users', data),

  getReviews: () => getStoredOrInit<Review[]>('moutanak_reviews', INITIAL_REVIEWS),
  setReviews: (data: Review[]) => saveStored('moutanak_reviews', data),

  getPayments: () => getStoredOrInit<PaymentPayout[]>('moutanak_payments', INITIAL_PAYMENTS),
  setPayments: (data: PaymentPayout[]) => saveStored('moutanak_payments', data),

  getTransactions: () => getStoredOrInit<Transaction[]>('moutanak_transactions', INITIAL_TRANSACTIONS),
  setTransactions: (data: Transaction[]) => saveStored('moutanak_transactions', data),

  getConfig: () => getStoredOrInit<PlatformConfig>('moutanak_config', INITIAL_CONFIG),
  setConfig: (data: PlatformConfig) => saveStored('moutanak_config', data)
};
