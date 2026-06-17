// components/ui/RichEditor.tsx
"use strict";
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        // Class Tailwind untuk styling area ketik (mirip prose / typography)
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px] border rounded-b-md p-4 bg-white",
      },
    },
    onUpdate: ({ editor }) => {
      // Mengirimkan HTML ke parent component setiap ada perubahan
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col border rounded-md shadow-sm">
      {/* Menu Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-300 font-bold" : "bg-gray-200"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-300 italic" : "bg-gray-200"
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300 font-bold" : "bg-gray-200"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-300" : "bg-gray-200"
          }`}
        >
          Bullet List
        </button>
      </div>

      {/* Area Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}