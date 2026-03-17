import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrate: {
    async adapter() {
      const { Pool } = await import('pg');
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const pool = new Pool({ connectionString: process.env.DIRECT_URL });
      return new PrismaPg(pool);
    },
  },
});
