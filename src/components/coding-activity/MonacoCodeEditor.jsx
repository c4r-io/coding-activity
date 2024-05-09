import Editor from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';

export default function MonacoCodeEditor({ onChange, value, height, width, language, theme, options, highlight = null }) {

    const [code, setCode] = useState(value);
    const editorRef = React.useRef(null);
    const decorationsRef = React.useRef([]);
    useEffect(() => {
        setCode(value);
        // console.log('value', value);
    }, [value])
    const onChangeHandler = (value, event) => {
        // console.log(value, event);
        onChange(value);
    }
    const themeData = {
        base: 'vs-dark', // can also base on 'vs' (light) or 'hc-black' (high contrast)
        inherit: true, // can inherit defaults from the base or set false to start fresh
        rules: [
            { "token": "number", "foreground": "B5CEA8" },
            {
                "background": "272822",
                "token": ""
            },
            {
                "foreground": "75715e",
                "token": "comment",
                "fontStyle": 'italic underline'
            },
            {
                "foreground": "939393",
                "token": "string"
            },
            {
                "foreground": "ae81ff",
                "token": "constant.numeric"
            },
            {
                "foreground": "ae81ff",
                "token": "constant.language"
            },
            {
                "foreground": "ae81ff",
                "token": "constant.character"
            },
            {
                "foreground": "ae81ff",
                "token": "constant.other"
            },
            {
                "foreground": "854ABE",
                "token": "keyword"
            },
            {
                "foreground": "f92672",
                "token": "storage"
            },
            {
                "foreground": "66d9ef",
                "fontStyle": "italic",
                "token": "storage.type"
            },
            {
                "foreground": "a6e22e",
                "fontStyle": "underline",
                "token": "entity.name.class"
            },
            {
                "foreground": "a6e22e",
                "fontStyle": "italic underline",
                "token": "entity.other.inherited-class"
            },
            {
                "foreground": "a6e22e",
                "token": "entity.name.function"
            },
            {
                "foreground": "fd971f",
                "fontStyle": "italic",
                "token": "variable.parameter"
            },
            {
                "foreground": "f92672",
                "token": "entity.name.tag"
            },
            {
                "foreground": "a6e22e",
                "token": "entity.other.attribute-name"
            },
            {
                "foreground": "66d9ef",
                "token": "support.function"
            },
            {
                "foreground": "66d9ef",
                "token": "support.constant"
            },
            {
                "foreground": "66d9ef",
                "fontStyle": "italic",
                "token": "support.type"
            },
            {
                "foreground": "66d9ef",
                "fontStyle": "italic",
                "token": "support.class"
            },
            {
                "foreground": "f8f8f0",
                "background": "f92672",
                "token": "invalid"
            },
            {
                "foreground": "f8f8f0",
                "background": "ae81ff",
                "token": "invalid.deprecated"
            },
            {
                "foreground": "cfcfc2",
                "token": "meta.structure.dictionary.json string.quoted.double.json"
            },
            {
                "foreground": "75715e",
                "token": "meta.diff"
            },
            {
                "foreground": "75715e",
                "token": "meta.diff.header"
            },
            {
                "foreground": "f92672",
                "token": "markup.deleted"
            },
            {
                "foreground": "a6e22e",
                "token": "markup.inserted"
            },
            {
                "foreground": "e6db74",
                "token": "markup.changed"
            },
            {
                "foreground": "ae81ffa0",
                "token": "constant.numeric.line-number.find-in-files - match"
            },
            {
                "foreground": "e6db74",
                "token": "entity.name.filename.find-in-files"
            }
        ],
        colors: {
            'editor.foreground': '#FFFFFF',
            'editor.background': '#242525',
            'editor.selectionBackground': '#854ABE44',
            'editorGutter.background': '#854abe',
            'editorLineNumber.foreground': '#ffffff',
            'editor.lineHighlightBackground': '#854ABE22',
            'editorCursor.foreground': '#854ABE',
            'editorWhitespace.foreground': '#2B2B2B'
        }
    };

    const editorDidMount = (editor, monaco) => {


        monaco.editor.defineTheme('custom-dark', themeData);
        monaco.editor.setTheme('custom-dark');
        editorRef.current = editor;
        // const textRange = { startLineNumber: 1, startColumn: 1, endLineNumber: 10, endColumn: 10 };
        // const message = "This is important!";
        // addPopupOnText(editor, textRange, message);
        // editor.onDidChangeCursorSelection(({ selection }) => {
        //     const text = editor.getModel().getValueInRange(selection);
        //     if (text) {
        //         showPopup(editor, selection, text);
        //     }
        // });
        // editor.createDecorationsCollection([
        //     {
        //         range: new monaco.Range(3, 1, 5, 1),
        //         options: {
        //             isWholeLine: true,
        //             linesDecorationsClassName: "myLineDecoration",
        //         },
        //     },
        //     {
        //         range: new monaco.Range(7, 1, 7, 24),
        //         options: { 
        // 	isWholeLine: true,
        //             inlineClassName: "myInlineDecoration" },
        //     },
        // ]);
    }
    const RemoveMark = () => {
        editorRef.current.changeDecorations((changeAccessor) => {
            decorationsRef.current.forEach((decoration) => {
                changeAccessor.changeDecorationOptions(decoration, {
                    inlineClassName: ""
                });
            });
        });
    }
    const Mark = (markRange) => {
        RemoveMark()
        const newRange = markRange.map((range) => {
            return { range: new monaco.Range(range.startLineNumber, 1, range.startLineNumber + 1, 1), options: { inlineClassName: 'highlight' } }
        });
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, newRange);
        // scroll to the line 
        scrollToLine(markRange[0].startLineNumber)
        // console.log('decorationsRef.current', decorationsRef.current, newRange);
    }

    const [highlightVisible, setHighlightVisible] = useState(true);
    useEffect(() => {
        // Initial highlighting setup
        // const initialDecorations = [{
        //   range: new monaco.Range(1, 1, 1, 10),
        //   options: { inlineClassName: 'highlight' },
        // }];
        // if (editorRef.current) {
        //   decorationsRef.current = editorRef.current.deltaDecorations([], initialDecorations);
        // }
    }, []);

    const toggleHighlightVisibility = () => {
        if (!editorRef.current) return;
        setHighlightVisible(!highlightVisible);
        editorRef.current.changeDecorations((changeAccessor) => {
            decorationsRef.current.forEach((decoration) => {
                changeAccessor.changeDecorationOptions(decoration, {
                    inlineClassName: highlightVisible ? '' : 'highlight'
                });
            });
        });
    };
    const findText = (text) => {
        if (!editorRef.current) return;
        const textList = text.split(' ');
        const validTextList = textList.filter((text) => text.length > 0);
        const model = editorRef.current.getModel();
        const matches = []
        validTextList.forEach((e) => {
            const match = model.findMatches("."+e, false, false, false, null, true);
            if(match.length > 0) matches.push(...match);
        });
        // console.log('matches', matches);
        if (matches.length > 0) {
            // const { range } = matches[0];
            return matches;
        }
        return null;
    };

    const scrollToLine = (lineNumber) => {
        if (!editorRef.current) return;

        editorRef.current.revealLineInCenter(lineNumber);
    };

    useEffect(() => {
        const matches = findText(highlight);
        if (matches) {
            Mark(matches.map((match) => match.range));
            // console.log('highlight matches: ', matches.map((match) => match.range));
        }
    }, [highlight]);
    return (
        <div>
            <Editor
                onMount={editorDidMount}
                onChange={onChangeHandler}
                height={height || '600px'}
                width={width || '100%'}
                defaultLanguage={language || 'python'}
                theme={theme || 'vs-dark'}
                options={options || {
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    lineNumbersMinChars: 2,
                    lineDecorationsWidth: 0,
                    glyphMargin: false
                }}
                defaultValue={code || ''}
            />
        </div>
    );
}