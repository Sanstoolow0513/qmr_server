import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown 编辑器",
  description: "在 MyBlog 中撰写、预览并保存 Markdown 文章。",
};

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
