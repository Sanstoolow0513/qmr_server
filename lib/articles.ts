import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { Article, ArticlesData } from './markdown';

export type { Article, ArticlesData };

const DATA_FILE = path.join(process.cwd(), 'data', 'articles.json');

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ articles: [] }, null, 2), 'utf-8');
  }
}

export async function getAllArticles(): Promise<Article[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  const parsed: ArticlesData = JSON.parse(data);
  return parsed.articles.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(a => a.id === id) || null;
}

export async function createArticle(
  title: string,
  content: string,
  tags: string[] = []
): Promise<Article> {
  const articles = await getAllArticles();
  const now = new Date().toISOString();

  const newArticle: Article = {
    id: randomUUID(),
    title,
    content,
    tags,
    createdAt: now,
    updatedAt: now,
  };

  articles.unshift(newArticle);
  await fs.writeFile(DATA_FILE, JSON.stringify({ articles }, null, 2), 'utf-8');

  return newArticle;
}

export async function updateArticle(
  id: string,
  updates: Partial<Omit<Article, 'id' | 'createdAt'>>
): Promise<Article | null> {
  const articles = await getAllArticles();
  const index = articles.findIndex(a => a.id === id);

  if (index === -1) return null;

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(DATA_FILE, JSON.stringify({ articles }, null, 2), 'utf-8');
  return articles[index];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await getAllArticles();
  const filtered = articles.filter(a => a.id !== id);

  if (filtered.length === articles.length) return false;

  await fs.writeFile(DATA_FILE, JSON.stringify({ articles: filtered }, null, 2), 'utf-8');
  return true;
}
