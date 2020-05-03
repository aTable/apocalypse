import React, { useEffect } from 'react';
import { Terminal } from 'xterm';

const TerminalComponent = () => {
  useEffect(() => {
    const terminal = new Terminal({});
    const terminalEl = document.querySelector('#terminal');
    terminal.open(terminalEl);
    terminal.write('oh yeah oh yeah');
  }, []);

  return (
    <>
      <div id="terminal" />
    </>
  );
};

export default TerminalComponent;
