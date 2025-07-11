import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { borrowers } from '../../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        const allBorrowers = await db.select().from(borrowers).orderBy(desc(borrowers.createdAt));
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(allBorrowers),
        };

      case 'POST':
        const newBorrowerData = JSON.parse(event.body);
        const [newBorrower] = await db.insert(borrowers).values({
          ...newBorrowerData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newBorrower),
        };

      case 'PUT':
        const { id, ...updateData } = JSON.parse(event.body);
        const [updatedBorrower] = await db.update(borrowers)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(borrowers.id, id))
          .returning();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedBorrower),
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        await db.delete(borrowers).where(eq(borrowers.id, deleteId));
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};