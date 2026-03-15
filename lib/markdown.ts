export interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesData {
  articles: Article[];
}

function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

export function parseMarkdown(text: string): string {
  // First escape HTML to prevent XSS, then apply markdown
  let html = escapeHtml(text)
    // Code blocks (process first to preserve content)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
      const language = lang || 'text';
      // Code content is already escaped, but we need to restore newlines
      const formattedCode = code.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${language}">${escapeHtml(formattedCode)}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-rose-600 px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4" />')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 text-gray-600 bg-blue-50 rounded-r">$1</blockquote>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    // Ordered lists (basic)
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="my-6 border-gray-200" />')
    // Line breaks
    .replace(/\n/g, '<br />');

  // Wrap list items in ul
  html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>)/g, '<ul class="list-disc ml-6 my-4 text-gray-700">$1</ul>');
  // Fix nested ul
  html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '');

  return html;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown syntax for excerpt
  const plainText = content
    .replace(/#+ /g, '')
    .replace(/```[\s\S]*?```/g, '[代码]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '[图片]')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n/g, ' ');

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}
