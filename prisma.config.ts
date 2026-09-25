// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('POSTGRES_URL'),
  },
  migrations: {
    path: "./prisma/migrations",
  },
});