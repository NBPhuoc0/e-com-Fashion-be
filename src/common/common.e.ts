export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  OTHER = 'Khác',
}

export enum ShippingStatus {
  PENDING = 'pending',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProductSize {
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
  XXL = 'xxl',
}

export enum PaymentMethod {
  COD = 'cod',
  BANKING = 'banking',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderStatus {
  PENDINGPAYMENT = 'pending payment',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}


export enum S3Bucket {
  PRODUCT = 'product',
  BANNER = 'banner',
  CAMPAIGN = 'campaign',
  BLOG = 'blog',
}
