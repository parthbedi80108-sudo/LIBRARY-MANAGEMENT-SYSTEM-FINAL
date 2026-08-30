// src/app/actions.ts
'use server';
import { db } from '@/src/prisma/db';

export async function getBooksFromDb() {
  try {
    // @ts-ignore
    const books = await db.book.findMany({ orderBy: { id: 'asc' } });
    return books;
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export async function addBookToDb(data: { id: number; title: string; author: string; category: string }) {
  try {
    // @ts-ignore
    await db.book.upsert({
      where: { id: data.id },
      update: { title: data.title, author: data.author, category: data.category },
      create: {
        id: data.id,
        title: data.title,
        author: data.author,
        category: data.category,
        isIssued: false,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to add book:', error);
    return { success: false };
  }
}

export async function updateBookIssueStatus(id: number, isIssued: boolean) {
  try {
    // @ts-ignore
    await db.book.update({
      where: { id },
      data: { isIssued },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to update status:', error);
    return { success: false };
  }
}

export async function deleteBookFromDb(id: number) {
  try {
    // @ts-ignore
    await db.book.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete book:', error);
    return { success: false };
  }
}