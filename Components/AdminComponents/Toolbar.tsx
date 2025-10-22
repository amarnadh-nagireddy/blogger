import React, { useEffect, useState, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import{ $createHeadingNode} from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $createParagraphNode
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useDebouncedCallback } from "use-debounce";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";


export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Updates toolbar button states
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setBold(selection.hasFormat("bold"));
      setItalic(selection.hasFormat("italic"));
      setUnderline(selection.hasFormat("underline"));
    }
  }, []);

  const handleSave = useDebouncedCallback(() => {
  editor.update(() => {
    const htmlContent = $generateHtmlFromNodes(editor, null);
    console.log("Saving HTML:", htmlContent);
    
  });
}, 500);


  // Register listeners for editor changes
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
        editorState.read(() => updateToolbar());
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
        handleSave();
      }),

      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),

      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar, handleSave]);

  // Handle heading changes
  const handleHeading = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (value === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(value as "h1" | "h2" | "h3" ));
        }
      }
    });
  };

  // Handle link creation
  const handleLink = () => {
    const url = prompt("Enter a URL (leave blank to remove link)");
    if (url === null) return;
    if (url.trim() === "") {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
    };


  return (
    <div className="toolbar m-2 p-2 border rounded flex flex-wrap items-center">
      <button type="button"
        className={`px-2 py-1 mr-1 border rounded-sm font-bold text-black hover:bg-gray-200 ${
          isBold ? "bg-gray-200" : ""
        }`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        B
      </button>

      <button type="button"
        className={`px-2 py-1 mr-1 border rounded-sm italic text-black hover:bg-gray-200 ${
          isItalic ? "bg-gray-200" : ""
        }`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        i
      </button>

      <button type="button"
        className={`px-2 py-1 mr-1 border rounded-sm underline text-black hover:bg-gray-200 ${
          isUnderline ? "bg-gray-200" : ""
        }`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        U
      </button>

      <select
        onChange={handleHeading}
        className="px-2 py-1 mr-1 border rounded-sm"
        defaultValue="paragraph"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <button type="button"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="px-2 py-1 mr-1 border rounded-sm text-black hover:bg-gray-200 disabled:opacity-50"
      >
        Undo
      </button>

      <button type="button"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="px-2 py-1 mr-1 border rounded-sm text-black hover:bg-gray-200 disabled:opacity-50"
      >
        Redo
      </button>

      <button type="button"
        onClick={handleLink}
        className="px-2 py-1 mr-1 border rounded-sm text-black hover:bg-gray-200"
      >
        Link
      </button>
        <select
  onChange={(event) => {
    const value = event.target.value;

    if (value === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (value === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (value === "remove") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    // reset dropdown to default so user sees “Lists” again
    event.target.value = "none";
  }}
  defaultValue="none"
  className="px-2 py-1 mr-1 border rounded-sm text-black hover:bg-gray-200"
>
  <option value="none" disabled>
    Lists
  </option>
  <option value="ul">• Unordered List</option>
  <option value="ol">1. Ordered List</option>
  <option value="remove">Remove List</option>
</select>

    

    </div>
  );
}
