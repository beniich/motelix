import path from 'node:path';
import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in environment variables');
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrate: {
    databaseUrl: process.env.DATABASE_URL,
  },
});
