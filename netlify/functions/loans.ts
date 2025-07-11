import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { loans } from '../../src/lib/db/schema';
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
        const allLoans = await db.select().from(loans).orderBy(desc(loans.createdAt));
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(allLoans),
        };

      case 'POST':
        const newLoanData = JSON.parse(event.body);
        const [newLoan] = await db.insert(loans).values({
          ...newLoanData,
          amount: newLoanData.amount.toString(),
          interestRate: newLoanData.interestRate.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newLoan),
        };

      case 'PUT':
        const { id, ...updateData } = JSON.parse(event.body);
        const updatePayload: any = { ...updateData, updatedAt: new Date() };
        if (updateData.amount) updatePayload.amount = updateData.amount.toString();
        if (updateData.interestRate) updatePayload.interestRate = updateData.interestRate.toString();
        
        const [updatedLoan] = await db.update(loans)
          .set(updatePayload)
          .where(eq(loans.id, id))
          .returning();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updatedLoan),
        };

      case 'DELETE':
        const deleteId = event.queryStringParameters?.id;
        await db.delete(loans).where(eq(loans.id, deleteId));
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