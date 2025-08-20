import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

// Base user interface without Mongoose-specific fields
export interface IUserBase {
  email: string;
  name: string;
  password: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// User response type (without sensitive data)
export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// User creation input type
export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
}

// User update input type
export interface IUpdateUserInput {
  name?: string;
  email?: string;
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
