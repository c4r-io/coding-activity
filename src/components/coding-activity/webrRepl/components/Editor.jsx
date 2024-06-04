import React from 'react';
import { FaPlay, FaRegSave } from 'react-icons/fa';
import { basicSetup, EditorView } from 'codemirror';
import { EditorState, Compartment, Prec } from '@codemirror/state';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { r } from 'codemirror-lang-r';
import './Editor.css';
import * as utils from './utils';
import createTheme from '@uiw/codemirror-themes';

import { tags as t } from "@lezer/highlight";
const language = new Compartment();
const tabSize = new Compartment();

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

export function FileTabs({ files, activeFileIdx, setActiveFileIdx, closeFile }) {
  return (
    <div
      role="tablist"
      aria-label="Currently Open Files"
      className="editor-files"
    >
      {files.map((f, index) => (
        <div
          key={index}
          className={'editor-file' + (activeFileIdx === index ? ' active' : '')}
          role="tab"
          id={`filetab-${index}`}
          aria-label={f.name}
        >
          <button
            className="editor-switch"
            aria-label={`Switch to ${f.name}`}
            onClick={() => setActiveFileIdx(index)}
          />
          <div className="editor-filename" aria-hidden="true">
            {f.name}
          </div>
          <button
            className="editor-close"
            aria-label={`Close ${f.name}`}
            onClick={(e) => {
              if (!f.ref.editorState.readOnly && !confirm('Close ' + f.name + '?')) {
                e.stopPropagation();
                return;
              }
              closeFile(e, index);
            }}
          >
            <div aria-hidden="true">&times;</div>
          </button>
        </div>
      ))}
    </div>
  );
}

export function Editor({ triggerRun,codeFromParent, webR, terminalInterface, filesInterface }) {
  const editorRef = React.useRef(null);
  const [editorView, setEditorView] = React.useState();
  const [files, setFiles] = React.useState([]);
  const [activeFileIdx, setActiveFileIdx] = React.useState(0);
  const runSelectedCode = React.useRef(() => {
    console.error('Unable to run code, webR not initialised.');
    // throw new Error('Unable to run code, webR not initialised.');
  });

  const activeFile = files[activeFileIdx];
  const isRFile = activeFile && activeFile.name.endsWith('.R');
  const isReadOnly = activeFile && activeFile.ref.editorState.readOnly;

  const completionMethods = React.useRef(null);

  React.useEffect(() => {
    let shelter = null;

    void webR.init().then(async () => {
      shelter = await new webR.Shelter();
      await webR.evalRVoid('rc.settings(func=TRUE, fuzzy=TRUE)');
      completionMethods.current = {
        assignLineBuffer: await shelter.evalR('utils:::.assignLinebuffer'),
        assignToken: await shelter.evalR('utils:::.assignToken'),
        assignStart: await shelter.evalR('utils:::.assignStart'),
        assignEnd: await shelter.evalR('utils:::.assignEnd'),
        completeToken: await shelter.evalR('utils:::.completeToken'),
        retrieveCompletions: await shelter.evalR('utils:::.retrieveCompletions'),
      };
    });

    return function cleanup() {
      if (shelter) void shelter.purge();
    };
  }, []);

  const completion = React.useCallback(async (context) => {
    if (!completionMethods.current) {
      return null;
    }
    const line = context.state.doc.lineAt(context.state.selection.main.head).text;
    const { from, to, text } = context.matchBefore(/[a-zA-Z0-9_.:]*/) ?? { from: 0, to: 0, text: '' };
    if (from === to && !context.explicit) {
      return null;
    }
    await completionMethods.current.assignLineBuffer(line);
    await completionMethods.current.assignToken(text);
    await completionMethods.current.assignStart(from + 1);
    await completionMethods.current.assignEnd(to + 1);
    await completionMethods.current.completeToken();
    const compl = await completionMethods.current.retrieveCompletions();
    const options = compl.values.map((val) => {
      if (!val) {
        return console.error('Missing values in completion result.');
        // throw new Error('Missing values in completion result.');
      }
      return { label: val };
    });

    return { from: from, options };
  }, []);

  const editorExtensions = [
    basicSetup,
    language.of(r()),
    tabSize.of(EditorState.tabSize.of(2)),
    Prec.high(
      keymap.of([
        indentWithTab,
        {
          key: 'Mod-Enter',
          run: () => {
            if (!runSelectedCode.current) return false;
            runSelectedCode.current();
            return true;
          },
        },
      ])
    ),
    autocompletion({ override: [completion] }),
    myTheme
  ];

  const closeFile = (e, index) => {
    e.stopPropagation();
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    const prevFile = activeFileIdx - 1;
    setActiveFileIdx(prevFile < 0 ? 0 : prevFile);
  };

  // React.useEffect(() => {
  //   runSelectedCode.current = () => {
  //     if (!editorView) {
  //       return;
  //     }
  //     let code = utils.getSelectedText(editorView);
  //     if (code === '') {
  //       code = utils.getCurrentLineText(editorView);
  //       utils.moveCursorToNextLine(editorView);
  //     }

  //     const codeArray = new TextEncoder().encode(code);
  //     webR.FS.writeFile('/tmp/.webRtmp-source', codeArray).then(() => {
  //       webR.writeConsole("source('/tmp/.webRtmp-source', echo = TRUE, max.deparse.length = Inf)");
  //     }, (reason) => {
  //       console.error(reason);
  //       console.error(`Can't run selected R code. See the JavaScript console for details.`);
  //       // throw new Error(`Can't run selected R code. See the JavaScript console for details.`);
  //     });
  //   };
  // }, [editorView]);

  const syncActiveFileState = React.useCallback(() => {
    if (!editorView || !activeFile) {
      return;
    }
    activeFile.ref.editorState = editorView.state;
    activeFile.ref.scrollTop = editorView.scrollDOM.scrollTop;
    activeFile.ref.scrollLeft = editorView.scrollDOM.scrollLeft;
  }, [activeFile, editorView]);

  const runFile = React.useCallback(() => {
    // if (!editorView) {
    //   return;
    // }
    // syncActiveFileState();
    // const code = editorView.state.doc.toString();
    const code = codeFromParent;
    terminalInterface.write('\x1b[2K\r');

    const codeArray = new TextEncoder().encode(code);
    console.log("web r code array ",code);
    webR.FS.writeFile('/tmp/.webRtmp-source', codeArray).then(() => {
      webR.writeConsole("source('/tmp/.webRtmp-source', echo = TRUE, max.deparse.length = Inf)");
    }, (reason) => {
      console.error(reason);
      console.error(`Can't run selected R code. See the JavaScript console for details.`);
      // throw new Error(`Can't run selected R code. See the JavaScript console for details.`);
    });
  }, [codeFromParent]);
  React.useEffect(() => {
    runFile();
  }, [triggerRun]);
  const saveFile = React.useCallback(() => {
    if (!editorView) {
      return;
    }

    syncActiveFileState();
    const code = editorView.state.doc.toString();
    const data = new TextEncoder().encode(code);

    webR.FS.writeFile(activeFile.path, data).then(() => {
      void filesInterface.refreshFilesystem();
    }, (reason) => {
      console.error(reason);
      console.error(`Can't save editor contents. See the JavaScript console for details.`);
      // throw new Error(`Can't save editor contents. See the JavaScript console for details.`);
    });
  }, [syncActiveFileState, editorView]);

  // React.useEffect(() => {
  //   if (!editorRef.current) {
  //     return;
  //   }
  //   const state = EditorState.create({ extensions: editorExtensions, doc: codeFromParent || "Hello", styles:{height: 300} });
  //   const view = new EditorView({
  //     state,
  //     parent: editorRef.current,
  //   });
  //   setEditorView(view);

  //   setFiles([{
  //     name: 'Untitled1.R',
  //     path: '/home/web_user/Untitled1.R',
  //     ref: {
  //       editorState: state,
  //     }
  //   }]);

  //   editorRef.current.style.maxHeight = `${codeFromParent?.split("\n").length * 19.5 + 20}px`
  //   return function cleanup() {
  //     view.destroy();
  //   };
  // }, [codeFromParent]);


  React.useEffect(() => {
    filesInterface.openFileInEditor = (name, path, readOnly) => {
      const existsIndex = files.findIndex((f) => f.path === path);
      if (existsIndex >= 0) {
        setActiveFileIdx(existsIndex);
        return Promise.resolve();
      }

      return webR.FS.readFile(path).then((data) => {
        syncActiveFileState();
        const updatedFiles = [...files];
        const extensions = name.toLowerCase().endsWith('.r') ? editorExtensions : [];
        if (readOnly) extensions.push(EditorState.readOnly.of(true));

        let content = new TextDecoder().decode(data);
        while (content.match(/.[\b]/)) {
          content = content.replace(/.[\b]/g, '');
        }

        const index = updatedFiles.push({
          name,
          path,
          ref: {
            editorState: EditorState.create({
              doc: content,
              extensions,
            }),
          }
        });
        setFiles(updatedFiles);
        setActiveFileIdx(index - 1);
      });
    };
  }, [files, filesInterface]);

  React.useEffect(() => {
    if (!editorView || files.length === 0) {
      return;
    }
    editorView.setState(activeFile.ref.editorState);
    editorView.requestMeasure({
      read: () => {
        editorView.scrollDOM.scrollTop = activeFile.ref.scrollTop ?? 0;
        editorView.scrollDOM.scrollLeft = activeFile.ref.scrollLeft ?? 0;
        return editorView.domAtPos(0).node;
      }
    });
    const container = editorView.contentDOM.parentElement;
    container?.setAttribute('role', 'tabpanel');
    container?.setAttribute('aria-labelledby', `filetab-${activeFileIdx}`);

    return function cleanup() {
      syncActiveFileState();
    };
  }, [files, syncActiveFileState, activeFile, editorView]);

  const displayStyle = files.length === 0 ? { display: 'none' } : undefined;
  return (
    // <div role="region"
    //   aria-label="Editor Pane"
    //   className="editor"
    //   style={displayStyle}
    // >
    //   <div
    //     aria-label="Editor"
    //     aria-describedby="editor-desc"
    //     className="editor-container"
    //     ref={editorRef}
    //   >
    //   </div>
    //   <p style={{ display: 'none' }} id="editor-desc">
    //     This component is an instance of the <a href="https://codemirror.net/">CodeMirror</a> interactive text editor.
    //     The editor has been configured so that the Tab key controls the indentation of code.
    //     To move focus away from the editor, press the Escape key, and then press the Tab key directly after it.
    //     Escape and then Shift-Tab can also be used to move focus backwards.
    //   </p>
    // </div>
    <div></div>
  );
}

export default Editor;
