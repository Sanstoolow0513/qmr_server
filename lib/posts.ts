import postsData from "@/data/posts.json";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  createdAt: string;
  readingTime: string;
}

export function getAllPosts(): Post[] {
  return postsData.posts.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return postsData.posts.find((post) => post.slug === slug);
}
