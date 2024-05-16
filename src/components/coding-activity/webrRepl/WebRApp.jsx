import React, { StrictMode } from 'react';
import Terminal from './components/Terminal';
import Editor from './components/Editor';
import Plot from './components/Plot';
import { WebR } from 'webr';
// import { CanvasMessage, PagerMessage } from 'webr/webR/webr-chan';
import './App.css';

const webR = new WebR({
  RArgs: [],
  REnv: {
    R_HOME: '/usr/lib/R',
    FONTCONFIG_PATH: '/etc/fonts',
    R_ENABLE_JIT: '0',
    COLORTERM: 'truecolor',
  },
});
globalThis.webR = webR;

const terminalInterface = {
  println: (msg) => { console.log(msg); },
  read: () => Promise.reject(new Error('Unable to read from webR terminal.')),
  write: (msg) => { console.log(msg); },
};

const filesInterface = {
  refreshFilesystem: () => Promise.resolve(),
  openFileInEditor: () => { throw new Error('Unable to open file, editor not initialised.'); },
};

const plotInterface = {
  newPlot: () => { return; },
  drawImage: () => {
    throw new Error('Unable to plot, plotting not initialised.');
  },
};

function handleCanvasMessage(msg) {
  if (msg.data.event === 'canvasImage') {
    plotInterface.drawImage(msg.data.image);
  } else if (msg.data.event === 'canvasNewPage') {
    plotInterface.newPlot();
  }
}

async function handlePagerMessage(msg) {
  const { path, title, deleteFile } = msg.data;
  await filesInterface.openFileInEditor(title, path, true);
  if (deleteFile) {
    await webR.FS.unlink(path);
  }
}

const WebRApp=({children})=> {
  return (
    <div className='repl'>
      {children}
    </div>
  );
}
WebRApp.Editor = ({triggerRun, codeFromParent})=>{
  return <Editor triggerRun={triggerRun} codeFromParent={codeFromParent} webR={webR} terminalInterface={terminalInterface} filesInterface={filesInterface} />;
}
WebRApp.Terminal = ()=>{
  return <Terminal webR={webR} terminalInterface={terminalInterface} />;
}
WebRApp.Plot = ()=>{
  return <Plot plotInterface={plotInterface} />;
}
export default WebRApp;

void (async () => {
  await webR.init();

  await webR.evalRVoid('webr::pager_install()');
  await webR.evalRVoid('webr::canvas_install()');

  await webR.evalRVoid('webr::shim_install()');

  const showMenu = crossOriginIsolated || navigator.serviceWorker.controller;
  await webR.evalRVoid('options(webr.show_menu = show_menu)', { env: { show_menu: !!showMenu } });
  await webR.evalRVoid('webr::global_prompt_install()', { withHandlers: false });

  terminalInterface.write('\x1b[2K\r');

  for (;;) {
    const output = await webR.read();
    switch (output.type) {
      case 'stdout':
        terminalInterface.println(output.data);
        break;
      case 'stderr':
        terminalInterface.println(`\x1b[1;31m${output.data}\x1b[m`);
        break;
      case 'prompt':
        void filesInterface.refreshFilesystem();
        terminalInterface.read(output.data).then((command) => {
          webR.writeConsole(command);
        }, (reason) => {
          console.error(reason);
          throw new Error(`An error occurred reading from the R console terminal.`);
        });
        break;
      case 'canvas':
        handleCanvasMessage(output);
        break;
      case 'pager':
        await handlePagerMessage(output);
        break;
      case 'closed':
        throw new Error('The webR communication channel has been closed');
      default:
        console.error(`Unimplemented output type: ${output.type}`);
        console.error(output.data);
    }
  }
})();
