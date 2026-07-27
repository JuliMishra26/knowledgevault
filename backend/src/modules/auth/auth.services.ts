import bcrypt from 'bcrypt';

import {
  type AuthPayload,
  type LoginInput,
  type RegisterInput,
  type User,
} from './auth.types';
import { prisma } from '@/lib/prisma';
import { signToken } from './jwt';

export async function register(input: RegisterInput): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(input.password, saltRounds);

  return await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });
}

export async function getUsers(): Promise<User[]> {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function login(input: LoginInput): Promise<AuthPayload> {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!existingUser) {
    throw new Error("User with this email doesn't exists.");
  }

  const { password, ...user } = existingUser;

  const isMatch = await bcrypt.compare(input.password, password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = signToken({
    id: existingUser.id,
    email: existingUser.email,
  });

  return {
    token,
    user,
  };
}
