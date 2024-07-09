// Module and model imports
import { PrismaClient, User } from "@prisma/client";

// Prisma declaration
const prisma = new PrismaClient();


// Service declarations

// Create user
const createUser = async (
  data: Omit<User, 'id'>
): Promise<Omit<User, 'password' | 'access_token'>> => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};

// Get user
const getUser = async (
  id: User['id']
): Promise<Omit<User, 'password' | 'access_token'> | null> => {
  return prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};

// Get many users
const getManyUsers = async (): Promise<User[] | null> => {
  return prisma.user.findMany();
};

// Update user
const updateUser = async (
  id: User['id'],
  data: Omit<Partial<User>, 'id' | 'password'>
): Promise<Omit<User, 'password' | 'access_token'>> => {
  return prisma.user.update({
    where: {
      id
    },
    data: {
      ...data
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};

// Delete user
const deleteUser = async (id: User['id']) => {
  return prisma.user.delete({
    where: {
      id
    }
  });
};

export const userService = {
  createUser,
  getUser,
  getManyUsers,
  updateUser,
  deleteUser
};