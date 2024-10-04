export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ProductSize {
  S = 'small',
  M = 'medium',
  L = 'large',
  XL = 'extra large',
  XXL = 'extra extra large',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit card',
  DEBIT_CARD = 'debit card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum S3Bucket {
  PRODUCT = 'product',
  BANNER = 'banner',
  CAMPAIGN = 'campaign',
  BLOG = 'blog',
}
