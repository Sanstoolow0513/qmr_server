'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Eye,
  Save,
  Plus,
  FileText,
  Tag,
  Clock,
  ChevronLeft,
  Trash2,
  RotateCcw,
  RotateCw,
  PanelLeft,
  PanelRight,
  Type,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Article, parseMarkdown, formatDate } from '@/lib/markdown';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useMarkdownShortcuts } from '@/hooks/useMarkdownShortcuts';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import EditorToolbar from '@/components/EditorToolbar';
import { ThemeToggle } from '@/components/theme';

export default function EditorPage() {
  // Core state
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Refs for toolbar actions
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Toast notifications
  const { showToast, ToastContainer } = useToast();

  // Auto save hook
  const { debouncedSave, restoreDraft, clearDraft, hasDraft, lastSavedAt } =
    useAutoSave({
      key: `editor-draft-${selectedId || 'new'}`,
      interval: 2000,
      onSave: () => {
        // Silent auto-save
      },
    });

  // Undo/Redo hook
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo({
    maxHistory: 50,
  });

  // Debounced content for preview
  const debouncedContent = useDebounce(content, 300);

  // Load articles on mount
  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft()) {
      const draft = restoreDraft();
      if (draft) {
        // Show restore dialog
        const shouldRestore = window.confirm(
          '检测到未保存的草稿，是否恢复？\n\n' +
            `标题: ${draft.title}\n` +
            `保存时间: ${new Date(draft.timestamp).toLocaleString('zh-CN')}`
        );
        if (shouldRestore) {
          setTitle(draft.title);
          setContent(draft.content);
          setTags(draft.tags);
          showToast('草稿已恢复', 'info');
        } else {
          clearDraft();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto save when content changes
  useEffect(() => {
    debouncedSave(content, title, tags);
  }, [content, title, tags, debouncedSave]);

  // Save state for undo/redo when content changes significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      saveState(content, title, tags);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, title, tags, saveState]);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.articles) {
        setArticles(data.articles);
        // Select first article by default if no article selected
        if (data.articles.length > 0 && !selectedId && !content) {
          selectArticle(data.articles[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
      showToast('加载文章失败', 'error');
    }
  };

  const selectArticle = (article: Article) => {
    setSelectedId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setTags(article.tags.join(', '));
    clearDraft();
  };

  const createNewArticle = () => {
    setSelectedId(null);
    setTitle('新文章');
    setContent('# 新文章\n\n开始写作...');
    setTags('');
    clearDraft();
    showToast('已创建新文章', 'info');
  };

  const saveArticle = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('标题和内容不能为空', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

      if (selectedId) {
        // Update existing
        const response = await fetch(`/api/articles/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, tags: tagList }),
        });
        if (response.ok) {
          await loadArticles();
          clearDraft();
          showToast('文章已更新', 'success');
        } else {
          showToast('保存失败', 'error');
        }
      } else {
        // Create new
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, tags: tagList }),
        });
        const data = await response.json();
        if (data.article) {
          setSelectedId(data.article.id);
          await loadArticles();
          clearDraft();
          showToast('文章已创建', 'success');
        } else {
          showToast('创建失败', 'error');
        }
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      showToast('保存失败，请重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCurrentArticle = async () => {
    if (!selectedId) return;
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return;

    try {
      const response = await fetch(`/api/articles/${selectedId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await loadArticles();
        createNewArticle();
        showToast('文章已删除', 'success');
      } else {
        showToast('删除失败', 'error');
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
      showToast('删除失败', 'error');
    }
  };

  // Handle undo
  const handleUndo = () => {
    const state = undo();
    if (state) {
      setContent(state.content);
      setTitle(state.title);
      setTags(state.tags);
      showToast('已撤销', 'info');
    }
  };

  // Handle redo
  const handleRedo = () => {
    const state = redo();
    if (state) {
      setContent(state.content);
      setTitle(state.title);
      setTags(state.tags);
      showToast('已重做', 'info');
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = useMarkdownShortcuts(saveArticle);

  // Toolbar actions
  const getTextarea = () => textareaRef.current;

  const wrapSelection = (prefix: string, suffix: string = prefix) => {
    const textarea = getTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const before = text.substring(0, start);
    const after = text.substring(end);

    const newValue = before + prefix + selectedText + suffix + after;
    setContent(newValue);

    // Restore selection
    setTimeout(() => {
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
      textarea.focus();
    }, 0);
  };

  const insertText = (text: string, selectOffset?: number) => {
    const textarea = getTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const newValue = value.substring(0, start) + text + value.substring(end);
    setContent(newValue);

    setTimeout(() => {
      const newCursorPos = start + text.length;
      if (selectOffset !== undefined) {
        textarea.selectionStart = newCursorPos - selectOffset;
        textarea.selectionEnd = newCursorPos;
      } else {
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      }
      textarea.focus();
    }, 0);
  };

  const toolbarActions = {
    onBold: () => wrapSelection('**'),
    onItalic: () => wrapSelection('*'),
    onStrikethrough: () => wrapSelection('~~'),
    onLink: () => {
      const textarea = getTextarea();
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const linkText = selectedText || '链接文本';
      insertText(`[${linkText}](url)`, 3);
    },
    onCode: () => wrapSelection('`'),
    onCodeBlock: () => {
      const textarea = getTextarea();
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const code = selectedText || '代码内容';
      insertText(`\n\`\`\`\n${code}\n\`\`\`\n`, selectedText ? 0 : 6);
    },
    onQuote: () => {
      const textarea = getTextarea();
      if (!textarea) return;
      const start = textarea.selectionStart;
      const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
      const before = textarea.value.substring(0, lineStart);
      const after = textarea.value.substring(lineStart);
      setContent(before + '> ' + after);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        textarea.focus();
      }, 0);
    },
    onBulletList: () => insertText('\n- ', 0),
    onOrderedList: () => insertText('\n1. ', 0),
    onTaskList: () => insertText('\n- [ ] ', 0),
    onHeading: () => {
      const textarea = getTextarea();
      if (!textarea) return;
      const start = textarea.selectionStart;
      const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = textarea.value.indexOf('\n', start);
      const actualLineEnd = lineEnd === -1 ? textarea.value.length : lineEnd;
      const currentLine = textarea.value.substring(lineStart, actualLineEnd);

      let newLine: string;
      if (currentLine.startsWith('### ')) {
        newLine = currentLine.substring(4);
      } else if (currentLine.startsWith('## ')) {
        newLine = '# ' + currentLine.substring(3);
      } else if (currentLine.startsWith('# ')) {
        newLine = '## ' + currentLine.substring(2);
      } else {
        newLine = '# ' + currentLine;
      }

      const before = textarea.value.substring(0, lineStart);
      const after = textarea.value.substring(actualLineEnd);
      setContent(before + newLine + after);

      setTimeout(() => {
        const newPosition = start + (newLine.length - currentLine.length);
        textarea.selectionStart = textarea.selectionEnd = newPosition;
        textarea.focus();
      }, 0);
    },
    onImage: () => {
      const url = prompt('请输入图片URL:', 'https://');
      if (url) {
        insertText(`\n![图片描述](${url})\n`, 0);
      }
    },
    onHorizontalRule: () => insertText('\n---\n', 0),
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo,
    canRedo,
  };

  // Statistics
  const currentArticle = articles.find((a) => a.id === selectedId);
  const charCount = content.length;
  const wordCount = content.replace(/\s/g, '').length;
  const lineCount = content.split('\n').length;
  const readingTime = Math.ceil(wordCount / 500); // 500 chars per minute for Chinese

  // Title character limit warning
  const titleLimit = 200;
  const titleWarning = title.length > titleLimit * 0.9;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--theme-surface)] border-b border-[var(--theme-border)] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Edit3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Markdown 编辑器</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Undo/Redo buttons */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              title="撤销 (Ctrl+Z)"
              className="p-2 text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-hover)] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              title="重做 (Ctrl+Y)"
              className="p-2 text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-hover)] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--theme-text-secondary)] hover:bg-[var(--theme-surface-hover)] rounded-lg transition-colors"
          >
            {showPreview ? (
              <>
                <PanelRight className="h-4 w-4" />
                隐藏预览
              </>
            ) : (
              <>
                <PanelLeft className="h-4 w-4" />
                显示预览
              </>
            )}
          </button>

          <ThemeToggle variant="icon" size="sm" />

          <button
            onClick={saveArticle}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar - Article List */}
        <aside className="w-64 bg-[var(--theme-surface)] border-r border-[var(--theme-border)] flex flex-col">
          <div className="p-4 border-b border-[var(--theme-border)]">
            <button
              onClick={createNewArticle}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--theme-text-primary)] text-[var(--theme-surface)] text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              新建文章
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => selectArticle(article)}
                className={`w-full text-left p-4 border-b border-[var(--theme-border-subtle)] transition-colors ${
                  selectedId === article.id
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-l-emerald-500'
                    : 'hover:bg-[var(--theme-surface-hover)] border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      selectedId === article.id
                        ? 'text-emerald-600'
                        : 'text-[var(--theme-text-tertiary)]'
                    }`}
                  />
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-medium truncate ${
                        selectedId === article.id
                          ? 'text-emerald-900'
                          : 'text-[var(--theme-text-primary)]'
                      }`}
                    >
                      {article.title}
                    </h4>
                    <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
                      {formatDate(article.updatedAt)}
                    </p>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-xs bg-[var(--theme-surface-hover)] text-[var(--theme-text-secondary)] rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 2 && (
                          <span className="text-xs +{article.tags.length - 2}">
                            +{article.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <EditorToolbar {...toolbarActions} />

          <div className="flex flex-1 overflow-hidden">
            {/* Editor Pane */}
            <div
              className={`${
                showPreview ? 'w-1/2' : 'w-full'
              } flex flex-col bg-white transition-all duration-200`}
            >
              {/* Title Input */}
              <div className="p-4 border-b border-[var(--theme-border)]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="文章标题"
                  maxLength={titleLimit}
                  className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                />
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Tag className="h-4 w-4 +{article.tags.length - 2}" />
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="标签，用逗号分隔"
                      className="flex-1 text-sm text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
                    />
                  </div>
                  {titleWarning && (
                    <div className="flex items-center gap-1 text-amber-600 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      <span>{title.length}/{titleLimit}</span>
                    </div>
                  )}
                  {selectedId && (
                    <button
                      onClick={deleteCurrentArticle}
                      className="+{article.tags.length - 2} hover:text-red-500 transition-colors"
                      title="删除文章"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="开始写作... 支持 Markdown 语法\n\n快捷键：\nCtrl+B 加粗  Ctrl+I 斜体  Ctrl+K 链接\nCtrl+S 保存  Ctrl+H 标题  Tab 缩进"
                  className="w-full h-full p-4 resize-none border-none outline-none text-gray-700 leading-relaxed font-mono text-sm"
                  spellCheck={false}
                />
              </div>

              {/* Status Bar */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1" title="字符数">
                    <Type className="h-3 w-3" />
                    {charCount} 字符
                  </span>
                  <span className="flex items-center gap-1" title="字数（不含空格）">
                    <BookOpen className="h-3 w-3" />
                    {wordCount} 字
                  </span>
                  <span>{lineCount} 行</span>
                  <span>约 {readingTime} 分钟阅读</span>
                  {lastSavedAt && (
                    <span className="text-emerald-600">
                      草稿已保存
                    </span>
                  )}
                </div>
                {currentArticle && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>更新于 {formatDate(currentArticle.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Pane */}
            {showPreview && (
              <div className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">预览</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <article
                    className="prose prose-slate max-w-none p-6"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(debouncedContent),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
