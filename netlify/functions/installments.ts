import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { installments } from '../../src/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        const allInstallments = await db.select().from(installments).orderBy(desc(installments.paymentDate));
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(allInstallments),
        };

      case 'POST':
        const newInstallmentData = JSON.parse(event.body);
        const [newInstallment] = await db.insert(installments).values({
          ...newInstallmentData,
          amount: newInstallmentData.amount.toString(),
          createdAt: new Date(),
        }).returning();
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newInstallment),
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        await db.delete(installments).where(eq(installments.id, deleteId));
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