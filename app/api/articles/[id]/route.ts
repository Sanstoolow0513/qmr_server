import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, tags } = body;

    // Input validation
    const updates: { title?: string; content?: string; tags?: string[] } = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      if (title.length > 200) {
        return NextResponse.json(
          { error: 'Title must be less than 200 characters' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string') {
        return NextResponse.json(
          { error: 'Content must be a string' },
          { status: 400 }
        );
      }
      if (content.length > 50000) {
        return NextResponse.json(
          { error: 'Content must be less than 50000 characters' },
          { status: 400 }
        );
      }
      updates.content = content;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return NextResponse.json(
          { error: 'Tags must be an array' },
          { status: 400 }
        );
      }
      updates.tags = tags
        .filter((t: unknown) => typeof t === 'string')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0 && t.length <= 20)
        .slice(0, 10); // Max 10 tags
    }

    const article = await updateArticle(id, updates);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const success = await deleteArticle(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
