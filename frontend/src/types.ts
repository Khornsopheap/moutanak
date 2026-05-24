export interface DocumentItem {
  t: 'id_front' | 'id_back' | 'selfie' | 'tin_cert' | 'biz_cert' | 'address_proof' | 'store_photo' | 'farm_photo' | 'product_photo' | string;
  s: string | null; // base64 or URL
}

export interface SellerRequest {
  id: string;
  fn: string; // full name
  em: string; // email
  ph: string; // phone
  dob: string;
  sn: string; // store name
  cat: string; // category
  prov: string; // province
  tin: string;
  breg: string; // business registration
  stk: string; // stock volume
  aba: string;
  abn: string;
  wing: string;
  desc: string; // description
  fb: string; // facebook
  st: 'pending' | 'approved' | 'rejected';
  sub: string; // submitted date string
  rev?: string; // reviewed date string
  note?: string; // admin review note
  docs: DocumentItem[];
  _src?: 'seed' | 'ls';
}

export interface Seller {
  id: string;
  name: string;
  storeName: string;
  email: string;
  phone: string;
  category: string;
  province: string;
  tin: string;
  joinedDate: string;
  status: 'active' | 'suspended';
  totalProducts: number;
  totalSales: number;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  sellerName: string;
  category: string;
  price: number;
  stock: number;
  salesCount: number;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'draft';
  imageAlt?: string;
  imageColor?: string;
}

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  province: string;
  itemsCount: number;
  items: OrderItem[];
  total: number;
  sellerName: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Reviewer' | 'Finance' | 'Support' | 'Customer';
  status: 'Active' | 'Away' | 'Suspended';
  phone?: string;
  joinedDate: string;
}

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Flagged';
}

export interface PaymentPayout {
  id: string;
  sellerName: string;
  amount: number;
  method: 'ABA Bank' | 'Wing Wallet' | 'ACLEDA Bank' | 'Cash';
  accountNo: string;
  accountName: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  customerName: string;
  type: 'Purchase' | 'Refund' | 'Payout';
  status: 'Success' | 'Pending' | 'Failed';
  method: 'ABA Bank' | 'Wing' | 'ACLEDA' | 'Credit Card';
  date: string;
}

export interface PlatformConfig {
  name: string;
  adminEmail: string;
  phone: string;
  defaultLanguage: 'English' | 'Khmer';
  commissionBase: number;
  commissionVerified: number;
  commissionPremium: number;
  requireTin: boolean;
  requireSelfie: boolean;
  requireAddress: boolean;
  autoApprove: boolean;
  requireBizReg: boolean;
  notifyNewSeller: boolean;
  notifyApproved: boolean;
  notifyNewOrder: boolean;
  notifyLowStock: boolean;
  notifyDailyEmail: boolean;
}
