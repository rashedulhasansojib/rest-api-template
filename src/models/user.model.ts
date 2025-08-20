import bcrypt from 'bcrypt';
import config from 'config';
import mongoose from 'mongoose';
import type { IUser, IUserModel, IUserTransform } from '../types/user.types';
import { UserRole, UserStatus } from '../types/user.types';
import logger from '../utils/logger';

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (
        _doc: IUser,
        ret: Record<string, unknown>
      ): IUserTransform {
        const transformed: IUserTransform = {
          id: ret['_id'] as string,
          email: ret['email'] as string,
          name: ret['name'] as string,
          role: ret['role'] as string,
          status: ret['status'] as string,
          createdAt: ret['createdAt'] as Date,
          updatedAt: ret['updatedAt'] as Date,
        };
        return transformed;
      },
    },
    toObject: {
      transform: function (
        _doc: IUser,
        ret: Record<string, unknown>
      ): IUserTransform {
        const transformed: IUserTransform = {
          id: ret['_id'] as string,
          email: ret['email'] as string,
          name: ret['name'] as string,
          role: ret['role'] as string,
          status: ret['status'] as string,
          createdAt: ret['createdAt'] as Date,
          updatedAt: ret['updatedAt'] as Date,
        };
        return transformed;
      },
    },
  }
);

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = config.get<number>('saltWorkFactor') || 12;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    logger.error({ error }, 'Error hashing password');
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods['comparePassword'] = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, (this as IUser).password);
  } catch (error) {
    logger.error({ error }, 'Error comparing passwords');
    throw new Error('Password comparison failed');
  }
};

// Static method to find user by email with password
userSchema.statics['findByEmail'] = function (email: string) {
  return this.findOne({ email }).select('+password');
};

// Handle duplicate key error
userSchema.post(
  'save',
  function (
    error: mongoose.Error & {
      code?: number;
      keyPattern?: Record<string, unknown>;
    },
    _doc: unknown,
    next: (err?: Error) => void
  ) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0];
      next(new Error(`${field} already exists`));
    } else {
      next(error);
    }
  }
);

const UserModel = mongoose.model<IUser>('User', userSchema) as IUserModel;

export default UserModel;
