import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomUUID, createHash } from 'crypto';
import { UserRole } from '../../common/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';

interface AuthResult {
  token: string;
  user: Omit<UserEntity, 'passwordHash'>;
}

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  create(createUserDto: CreateUserDto): Omit<UserEntity, 'passwordHash'> {
    const emailExists = this.users.some((user) => user.email === createUserDto.email);
    if (emailExists) {
      throw new UnauthorizedException('Email already registered');
    }

    const now = new Date();
    const id = randomUUID();
    const passwordHash = this.hashPassword(createUserDto.password);

    const user: UserEntity = {
      id,
      name: createUserDto.name,
      email: createUserDto.email,
      phone: createUserDto.phone,
      avatarUrl: undefined,
      role: createUserDto.role,
      passwordHash,
      createdAt: now
    };

    if (createUserDto.customerProfile) {
      user.customerProfile = {
        address: createUserDto.customerProfile.address,
        location: createUserDto.customerProfile.location,
        preferences: createUserDto.customerProfile.preferences
      };
    }

    if (createUserDto.sellerProfile) {
      user.sellerProfile = {
        storeName: createUserDto.sellerProfile.storeName,
        categoryId: createUserDto.sellerProfile.categoryId,
        taxId: createUserDto.sellerProfile.taxId,
        status: 'pending',
        address: createUserDto.sellerProfile.address,
        location: createUserDto.sellerProfile.location,
        documents: createUserDto.sellerProfile.documents ?? []
      };
    }

    if (createUserDto.driverProfile) {
      user.driverProfile = {
        licenseNumber: createUserDto.driverProfile.licenseNumber,
        vehicleInfo: createUserDto.driverProfile.vehicleInfo,
        status: 'pending',
        address: createUserDto.driverProfile.address,
        location: createUserDto.driverProfile.location
      };
    }

    this.users.push(user);

    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  authenticate(loginDto: LoginDto): AuthResult {
    const user = this.users.find((candidate) => candidate.email === loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hash = this.hashPassword(loginDto.password);
    if (hash !== user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload = Buffer.from(
      JSON.stringify({ sub: user.id, role: user.role, issuedAt: Date.now() })
    ).toString('base64url');

    const { passwordHash: _, ...publicUser } = user;
    return {
      token: `mock.${tokenPayload}.signature`,
      user: publicUser
    };
  }

  findAll(role?: UserRole): Omit<UserEntity, 'passwordHash'>[] {
    return this.users
      .filter((user) => (role ? user.role === role : true))
      .map(({ passwordHash: _unused, ...rest }) => rest);
  }

  findOne(id: string): Omit<UserEntity, 'passwordHash'> {
    const user = this.users.find((candidate) => candidate.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  updateSellerStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    const user = this.users.find(
      (candidate) => candidate.id === id && candidate.role === UserRole.SELLER
    );
    if (!user || !user.sellerProfile) {
      throw new NotFoundException('Seller not found');
    }

    user.sellerProfile.status = status;
    return this.stripPassword(user);
  }

  updateDriverStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    const user = this.users.find(
      (candidate) => candidate.id === id && candidate.role === UserRole.DRIVER
    );
    if (!user || !user.driverProfile) {
      throw new NotFoundException('Driver not found');
    }

    user.driverProfile.status = status;
    return this.stripPassword(user);
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  private stripPassword(user: UserEntity): Omit<UserEntity, 'passwordHash'> {
    const { passwordHash: _, ...rest } = user;
    return rest;
  }
}
