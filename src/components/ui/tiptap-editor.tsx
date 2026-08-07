"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  label: string;
  title: string;
}

function ToolbarButton({ onClick, isActive, label, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`px-2 py-1 text-sm font-medium rounded border transition-colors ${
        isActive
          ? "bg-gray-800 text-white border-gray-800"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL du lien :", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 border border-b-0 border-gray-300 rounded-t-md bg-gray-50 p-2"
      role="toolbar"
      aria-label="Barre d'outils de formatage"
    >
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        label="B"
        title="Gras"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        label="I"
        title="Italique"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        label="H2"
        title="Titre 2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        label="H3"
        title="Titre 3"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        label="•"
        title="Liste à puces"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        label="1."
        title="Liste numérotée"
      />
      <ToolbarButton
        onClick={handleLink}
        isActive={editor.isActive("link")}
        label="🔗"
        title="Lien"
      />
    </div>
  );
}

export function TiptapEditor({ content, onChange, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external content changes without recreating editor
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className={className}>
      <EditorToolbar editor={editor} />
      <div className="border border-gray-300 rounded-b-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 min-h-[200px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[200px] [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline"
        />
      </div>
    </div>
  );
}