import { UserRole } from '../../../common/enums';
import { GeoLocation } from '../../../common/geo';

export interface BaseProfile {
  address?: string;
  location?: GeoLocation;
}

export interface CustomerProfile extends BaseProfile {
  preferences?: string[];
}

export interface SellerProfile extends BaseProfile {
  storeName: string;
  categoryId: string;
  taxId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

export interface DriverProfile extends BaseProfile {
  licenseNumber: string;
  vehicleInfo: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
  customerProfile?: CustomerProfile;
  sellerProfile?: SellerProfile;
  driverProfile?: DriverProfile;
}
