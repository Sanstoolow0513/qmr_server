import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, createArticle } from '@/lib/articles';

export async function GET(): Promise<NextResponse> {
  try {
    const articles = await getAllArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { title, content, tags } = body;

    // Input validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content must be less than 50000 characters' },
        { status: 400 }
      );
    }

    // Validate tags
    let validatedTags: string[] = [];
    if (tags) {
      if (!Array.isArray(tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array' },
          { status: 400 }
        );
      }
      validatedTags = tags
        .filter((t: unknown) => typeof t === 'string')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0 && t.length <= 20)
        .slice(0, 10); // Max 10 tags
    }

    const article = await createArticle(title.trim(), content, validatedTags);
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
