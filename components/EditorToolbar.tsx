'use client';

import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  Code,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Heading,
  Image,
  Minus,
  Undo,
  Redo,
} from 'lucide-react';

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
}

interface EditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
  onLink: () => void;
  onCode: () => void;
  onCodeBlock: () => void;
  onQuote: () => void;
  onBulletList: () => void;
  onOrderedList: () => void;
  onTaskList: () => void;
  onHeading: () => void;
  onImage: () => void;
  onHorizontalRule: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function EditorToolbar({
  onBold,
  onItalic,
  onStrikethrough,
  onLink,
  onCode,
  onCodeBlock,
  onQuote,
  onBulletList,
  onOrderedList,
  onTaskList,
  onHeading,
  onImage,
  onHorizontalRule,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProps) {
  const toolbarGroups: ToolbarButton[][] = [
    // History
    [
      { icon: <Undo size={16} />, label: '撤销', shortcut: 'Ctrl+Z', action: onUndo, disabled: !canUndo },
      { icon: <Redo size={16} />, label: '重做', shortcut: 'Ctrl+Y', action: onRedo, disabled: !canRedo },
    ],
    // Formatting
    [
      { icon: <Bold size={16} />, label: '加粗', shortcut: 'Ctrl+B', action: onBold },
      { icon: <Italic size={16} />, label: '斜体', shortcut: 'Ctrl+I', action: onItalic },
      { icon: <Strikethrough size={16} />, label: '删除线', shortcut: 'Ctrl+Shift+X', action: onStrikethrough },
    ],
    // Headers
    [
      { icon: <Heading size={16} />, label: '标题', shortcut: 'Ctrl+H', action: onHeading },
    ],
    // Lists
    [
      { icon: <List size={16} />, label: '无序列表', action: onBulletList },
      { icon: <ListOrdered size={16} />, label: '有序列表', action: onOrderedList },
      { icon: <CheckSquare size={16} />, label: '任务列表', action: onTaskList },
    ],
    // Insert
    [
      { icon: <Link size={16} />, label: '链接', shortcut: 'Ctrl+K', action: onLink },
      { icon: <Image size={16} aria-label="图片" />, label: '图片', action: onImage },
      { icon: <Code size={16} />, label: '行内代码', shortcut: 'Ctrl+`', action: onCode },
      { icon: <Code size={16} />, label: '代码块', shortcut: 'Ctrl+Shift+C', action: onCodeBlock },
      { icon: <Quote size={16} />, label: '引用', action: onQuote },
      { icon: <Minus size={16} />, label: '分割线', action: onHorizontalRule },
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
      {toolbarGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center">
          {group.map((button, buttonIndex) => (
            <button
              key={buttonIndex}
              onClick={button.action}
              disabled={button.disabled}
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 transition-colors"
            >
              {button.icon}
            </button>
          ))}
          {groupIndex < toolbarGroups.length - 1 && (
            <div className="w-px h-5 bg-gray-300 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}
