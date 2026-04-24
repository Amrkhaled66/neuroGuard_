import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://postgres:1234@localhost:5432/neuroguard"
  },
});
