"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube as YoutubeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TipTapEditorProps {
  content?: JSONContent;
  onChange: (json: JSONContent, html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Youtube.configure({ width: 640, height: 360 }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Typography,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-gray max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) return null;

  function addImage() {
    const url = window.prompt("Image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  function addLink() {
    const url = window.prompt("Link URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  function addYoutube() {
    const url = window.prompt("YouTube URL:");
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b bg-muted">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") && "bg-accent text-primary")}
          title="Bold"
        >
          <Bold />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") && "bg-accent text-primary")}
          title="Italic"
        >
          <Italic />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive("underline") && "bg-accent text-primary")}
          title="Underline"
        >
          <UnderlineIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(editor.isActive("strike") && "bg-accent text-primary")}
          title="Strikethrough"
        >
          <Strikethrough />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(editor.isActive("heading", { level: 1 }) && "bg-accent text-primary")}
          title="Heading 1"
        >
          <Heading1 />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive("heading", { level: 2 }) && "bg-accent text-primary")}
          title="Heading 2"
        >
          <Heading2 />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(editor.isActive("heading", { level: 3 }) && "bg-accent text-primary")}
          title="Heading 3"
        >
          <Heading3 />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive("bulletList") && "bg-accent text-primary")}
          title="Bullet List"
        >
          <List />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive("orderedList") && "bg-accent text-primary")}
          title="Ordered List"
        >
          <ListOrdered />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive("blockquote") && "bg-accent text-primary")}
          title="Quote"
        >
          <Quote />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(editor.isActive("codeBlock") && "bg-accent text-primary")}
          title="Code Block"
        >
          <Code />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(editor.isActive({ textAlign: "left" }) && "bg-accent text-primary")}
          title="Align Left"
        >
          <AlignLeft />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(editor.isActive({ textAlign: "center" }) && "bg-accent text-primary")}
          title="Align Center"
        >
          <AlignCenter />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(editor.isActive({ textAlign: "right" }) && "bg-accent text-primary")}
          title="Align Right"
        >
          <AlignRight />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button type="button" variant="ghost" size="icon-xs" onClick={addImage} title="Insert Image">
          <ImageIcon />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" onClick={addLink} title="Insert Link">
          <LinkIcon />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" onClick={addYoutube} title="Insert YouTube Video">
          <YoutubeIcon />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
