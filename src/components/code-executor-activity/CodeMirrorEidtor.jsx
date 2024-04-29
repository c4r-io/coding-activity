"use client";
import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tags as t } from "@lezer/highlight";
const myTheme = createTheme({
    theme: "light",
    settings: {
        background: "#242525",
        backgroundImage: "",
        foreground: "#ffffff",
        caret: "#fff",
        selection: "#036dd626",
        selectionMatch: "#036dd626",
        lineHighlight: "#8a91991a",
        gutterBackground: "#854ABE",
        gutterForeground: "#fff",
    },
    styles: [
        { tag: t.comment, color: "#858585" },
        { tag: t.variableName, color: "#ffffff" },
        { tag: [t.string, t.special(t.brace)], color: "#a4a4a4" },
        { tag: t.number, color: "#907b9a" },
        { tag: t.bool, color: "#A46932" },
        { tag: t.null, color: "#A46932" },
        { tag: t.keyword, color: "#854ABE" },
        { tag: t.operator, color: "#A46932" },
        { tag: t.className, color: "#DD8B3C" },
        { tag: t.definition(t.typeName), color: "#A46932" },
        { tag: t.typeName, color: "#A46932" },
        { tag: t.angleBracket, color: "#A46932" },
        { tag: t.paren, color: "#fff" },
        { tag: t.brace, color: "#fff" },
        { tag: t.squareBracket, color: "#fff" },
        { tag: t.tagName, color: "#A46932" },
        { tag: t.attributeName, color: "#532688" },
        { tag: [t.function(t.variableName)], color: "#DD8B3C" },
    ],
});
// const extensions = [python()];
const CodeMirrorEidtor = ({value, onChange, height, language}) => {
    const [extensions,setExtentions] = React.useState([loadLanguage(`python`)]);
    useEffect(() => {
        setExtentions([loadLanguage(`${language? language: 'python'}`)]);
    },[language])
    return (
        <CodeMirror
            value={value|| ""}
            onChange={(e) => {
                onChange(e);
            }}
            height={height || "400px"}
            theme={myTheme}
            extensions={extensions}
        />
    )
}

export default CodeMirrorEidtor