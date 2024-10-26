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
  COD = 'COD',
  VNPAY = 'VNPAY',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
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
