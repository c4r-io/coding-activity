import React from 'react';
import { Terminal as XTerminal } from 'xterm';
import { Readline } from 'xterm-readline';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export function Terminal({ webR, terminalInterface }) {
  const divRef = React.useRef(null);
  const termRef = React.useRef(null);
  const [readline, setReadline] = React.useState(null);

  const handleShortcuts = React.useCallback((event) => {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }

    if (event.key === 'c' && event.ctrlKey) {
      webR.interrupt();
    }
  }, []);

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener('keydown', handleShortcuts, true);
      return () => {
        divRef.current?.removeEventListener('keydown', handleShortcuts);
      };
    }
  }, [handleShortcuts]);

  React.useEffect(() => {
    if (termRef.current || !divRef.current) {
      return;
    }

    const term = new XTerminal({
      theme: {
        background: '#000',
        foreground: '#fff',
        cursor: '#fff',
        selectionBackground: '#99C',
      },
      screenReaderMode: true,
    });
    term.write('webR is downloading, please wait...');

    const fitAddon = new FitAddon();
    const readline = new Readline();
    setReadline(readline);

    term.loadAddon(fitAddon);
    term.loadAddon(readline);
    term.open(divRef.current);
    term.element?.setAttribute('aria-label', 'R Terminal');
    term.element?.setAttribute('tabindex', '-1');
    fitAddon.fit();

    const resizeObserver = new ResizeObserver(() => {
      void webR.init().then(() => {
        const dims = fitAddon.proposeDimensions();
        return webR.evalRVoid(`options(width=${dims ? dims.cols : 80})`);
      });
      fitAddon.fit();
    });
    resizeObserver.observe(divRef.current);

    termRef.current = term;
  }, []);

  React.useEffect(() => {
    if (!readline) {
      return;
    }

    terminalInterface.println = (msg) => {
      readline.println(msg);
    };

    terminalInterface.write = (msg) => {
      readline.write(msg);
    };

    terminalInterface.read = async (prompt) => {
      return readline.read(prompt);
    };
  }, [readline, terminalInterface]);

  return (
    <div
      role="region"
      aria-label="Terminal Pane"
      ref={divRef}
      className='term'
    ></div>
  );
}

export default Terminal;
