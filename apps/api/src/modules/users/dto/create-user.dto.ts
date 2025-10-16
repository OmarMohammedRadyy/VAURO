import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../../common/enums';

class GeoLocationDto {
  @IsNotEmpty()
  latitude!: number;

  @IsNotEmpty()
  longitude!: number;
}

class CustomerProfileDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}

class SellerProfileDto {
  @IsNotEmpty()
  @IsString()
  storeName!: string;

  @IsNotEmpty()
  @IsString()
  categoryId!: string;

  @IsNotEmpty()
  @IsString()
  taxId!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}

class DriverProfileDto {
  @IsNotEmpty()
  @IsString()
  licenseNumber!: string;

  @IsNotEmpty()
  @IsString()
  vehicleInfo!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Length(8, 128)
  password!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerProfileDto)
  customerProfile?: CustomerProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SellerProfileDto)
  sellerProfile?: SellerProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DriverProfileDto)
  driverProfile?: DriverProfileDto;
}
