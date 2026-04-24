import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = 'db';
@Module({
  providers: [
    {
      provide: db,
      useValue: drizzle({ client: pool }),
    },
  ],
  exports: [db],
})
export class DbModule {}
