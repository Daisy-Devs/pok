"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./ui/button";
import { SetStateAction, Dispatch } from "react";
import { NgoRegistrationFormData } from "../features/ngo-registration/types";
import { List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: Dispatch<
    SetStateAction<NgoRegistrationFormData["missionStatement"]>
  >;
}
export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
    })],
    immediatelyRender: false,
    content: value,
    editorProps: {
    transformPastedHTML(html) {
      return html; 
    },
  },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // gives you HTML string
    },
  });

  return (
    <div id="mission-cause" className="border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        <Button
          variant="outline"
          text="B"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 h-8 aspect-square rounded text-sm font-bold ${editor?.isActive("bold") ? "bg-gray-200" : ""}`}
        />
        <Button
          variant="outline"
          text="I"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 h-8 aspect-square rounded text-sm italic ${editor?.isActive("italic") ? "bg-gray-200" : ""}`}
        />
        <Button
          variant="outline"
          text="S"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`p-1 h-8 aspect-square rounded text-sm line-through ${editor?.isActive("strike") ? "bg-gray-200" : ""}`}
        />
        <Button
          variant="outline"
          text="U"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-1 h-8 aspect-square rounded text-sm underline ${editor?.isActive("underline") ? "bg-gray-200" : ""}`}
        />
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          text="H1"
          onClick={() =>{
            console.log("can toggle?", editor?.can().toggleHeading({ level: 1 }));
            editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          }
          className={`p-1 h-8 aspect-square rounded text-sm font-bold ${editor?.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
        />
        <Button
            type="button"
          variant="outline"
          leftIcon={<List size={15} />}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 h-8 aspect-square rounded text-sm ${editor?.isActive("bulletList") ? "bg-gray-200" : ""}`}
        />
        <Button
          type="button"

          variant="outline"
          leftIcon={<ListOrdered size={15} />}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1 h-8 aspect-square rounded text-sm ${editor?.isActive("orderedList") ? "bg-gray-200" : ""}`}
        />
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[150px] focus:outline-none"
      />
    </div>
  );
}
