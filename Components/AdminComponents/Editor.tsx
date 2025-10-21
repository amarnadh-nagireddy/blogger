import React, { useEffect,useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import Toolbar from "@/Components/AdminComponents/Toolbar";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useDebouncedCallback } from "use-debounce";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";



function onError(error:any ){
  console.error(error);
}
function EditorContent({ value, onChange }: { value?: string; onChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const lastValueRef = useRef<string | undefined>(undefined);

  const handleSave = useDebouncedCallback(() => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor, null);
      if (html !== lastValueRef.current) {
        lastValueRef.current = html;
        onChange?.(html);
      }
    });
  }, 400);

  useEffect(() => editor.registerUpdateListener(() => handleSave()), [editor, handleSave]);

  // Only reset editor when value truly changes
  useEffect(() => {
    if (!value || value === lastValueRef.current) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });

    lastValueRef.current = value;
  }, [editor, value]);

  return (
    <>
      <Toolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className="border min-h-[200px] p-2 rounded" />}
        placeholder={<div>Enter your blog content...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LinkPlugin />
      <ListPlugin />
      <AutoFocusPlugin />
    </>
  );
}

export default function Editor({value,onChange,}: {value?: string;onChange?: (html: string) => void;}) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme:exampleTheme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode,  LinkNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
       <EditorContent value={value} onChange={onChange} />
    </LexicalComposer>
  );
}
const exampleTheme = {
  paragraph: 'editor-paragraph',
  
  heading: {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-semibold',
    
  },
  list: {
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
  },
  

  link: 'text-blue-500 underline cursor-pointer',
  text: {
    bold: 'font-bold',
    code: 'editor-textCode',
    italic: 'italic',
    underline: 'underline',
  }
  
};

