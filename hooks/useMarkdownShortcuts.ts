'use client';

import { useCallback, KeyboardEvent } from 'react';

interface ShortcutAction {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: (textarea: HTMLTextAreaElement) => void;
}

// Wrap selected text with prefix and suffix
function wrapSelection(textarea: HTMLTextAreaElement, prefix: string, suffix: string = prefix) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);

  const before = text.substring(0, start);
  const after = text.substring(end);

  const newValue = before + prefix + selectedText + suffix + after;
  textarea.value = newValue;

  // Restore selection with wrapped text
  textarea.selectionStart = start + prefix.length;
  textarea.selectionEnd = end + prefix.length;
  textarea.focus();

  // Trigger input event for React state update
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

// Insert text at cursor
function insertText(textarea: HTMLTextAreaElement, text: string, selectOffset?: number) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  const newValue = value.substring(0, start) + text + value.substring(end);
  textarea.value = newValue;

  const newCursorPos = start + text.length;
  if (selectOffset !== undefined) {
    textarea.selectionStart = newCursorPos - selectOffset;
    textarea.selectionEnd = newCursorPos;
  } else {
    textarea.selectionStart = textarea.selectionEnd = newCursorPos;
  }
  textarea.focus();

  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

// Handle Tab key - insert spaces or indent
function handleTab(textarea: HTMLTextAreaElement) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  if (start !== end) {
    // Multi-line selection - indent all lines
    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);

    const lines = selected.split('\n');
    const indentedLines = lines.map((line) => '  ' + line);
    const newValue = before + indentedLines.join('\n') + after;

    textarea.value = newValue;
    textarea.selectionStart = start;
    textarea.selectionEnd = end + indentedLines.length * 2;
  } else {
    // Single cursor - insert spaces
    const before = value.substring(0, start);
    const after = value.substring(end);
    const indent = '  ';

    textarea.value = before + indent + after;
    textarea.selectionStart = textarea.selectionEnd = start + indent.length;
  }

  textarea.focus();
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

export function useMarkdownShortcuts(onSave?: () => void) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = event.target as HTMLTextAreaElement;

      // Handle Tab key separately (always available)
      if (event.key === 'Tab') {
        event.preventDefault();
        handleTab(textarea);
        return;
      }

      // Define shortcuts inside callback to avoid dependency issues
      const shortcuts: ShortcutAction[] = [
        // Bold: Ctrl/Cmd + B
        {
          key: 'b',
          ctrlKey: true,
          action: (t) => wrapSelection(t, '**'),
        },
        // Italic: Ctrl/Cmd + I
        {
          key: 'i',
          ctrlKey: true,
          action: (t) => wrapSelection(t, '*'),
        },
        // Strikethrough: Ctrl/Cmd + Shift + X
        {
          key: 'x',
          ctrlKey: true,
          shiftKey: true,
          action: (t) => wrapSelection(t, '~~'),
        },
        // Link: Ctrl/Cmd + K
        {
          key: 'k',
          ctrlKey: true,
          action: (t) => {
            const start = t.selectionStart;
            const end = t.selectionEnd;
            const selectedText = t.value.substring(start, end);
            const linkText = selectedText || '链接文本';
            insertText(t, `[${linkText}](url)`, 3);
          },
        },
        // Inline code: Ctrl/Cmd + `
        {
          key: '`',
          ctrlKey: true,
          action: (t) => wrapSelection(t, '`'),
        },
        // Code block: Ctrl/Cmd + Shift + C
        {
          key: 'c',
          ctrlKey: true,
          shiftKey: true,
          action: (t) => {
            const start = t.selectionStart;
            const end = t.selectionEnd;
            const selectedText = t.value.substring(start, end);
            const code = selectedText || '代码内容';
            insertText(t, `\n\`\`\`\n${code}\n\`\`\`\n`, selectedText ? 0 : 6);
          },
        },
        // Heading: Ctrl/Cmd + H
        {
          key: 'h',
          ctrlKey: true,
          action: (t) => {
            const start = t.selectionStart;
            const lineStart = t.value.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = t.value.indexOf('\n', start);
            const actualLineEnd = lineEnd === -1 ? t.value.length : lineEnd;
            const currentLine = t.value.substring(lineStart, actualLineEnd);

            // Toggle heading level (no heading -> # -> ## -> ### -> no heading)
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

            const before = t.value.substring(0, lineStart);
            const after = t.value.substring(actualLineEnd);
            t.value = before + newLine + after;

            const newPosition = start + (newLine.length - currentLine.length);
            t.selectionStart = t.selectionEnd = newPosition;
            t.focus();
            t.dispatchEvent(new Event('input', { bubbles: true }));
          },
        },
        // Save: Ctrl/Cmd + S
        {
          key: 's',
          ctrlKey: true,
          action: () => {
            onSave?.();
          },
        },
      ];

      // Find matching shortcut
      const shortcut = shortcuts.find((s) => {
        const keyMatch = event.key.toLowerCase() === s.key.toLowerCase();
        const ctrlMatch = s.ctrlKey ? event.ctrlKey || event.metaKey : true;
        const shiftMatch = s.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = s.altKey ? event.altKey : !event.altKey;
        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.action(textarea);
      }
    },
    [onSave]
  );

  return handleKeyDown;
}
