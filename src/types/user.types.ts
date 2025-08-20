import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

// User role enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

// User status enum
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Base user interface without Mongoose-specific fields
export interface IUserBase {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose document interface
export interface IUser extends IUserBase, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Mongoose model interface with static methods
export interface IUserModel extends mongoose.Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// Transform function return type
export interface IUserTransform {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// User response type (without sensitive data)
export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// User creation input type
export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// User update input type
export interface IUpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

// Authentication types
export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
  expiresIn: string;
}

// API response types
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}
