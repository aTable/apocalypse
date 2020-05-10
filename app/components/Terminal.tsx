import React, { useEffect, useContext, useState } from 'react';
import { Terminal, ITerminalOptions, IEvent } from 'xterm';
import TerminalContext from '../stores/TerminalContext';

const terminalOptions: ITerminalOptions = {
  cursorBlink: true
};

const TerminalComponent = () => {
  const { state } = useContext(TerminalContext);
  const [terminal] = useState<Terminal>(new Terminal(terminalOptions));

  function keyPressed({
    key,
    domEvent
  }: {
    key: string;
    domEvent: KeyboardEvent;
  }) {
    const printable =
      !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    switch (domEvent.keyCode) {
      // enter
      case 13:
        terminal.write(
          `\r\n user driven commands unsupported at this stage\r\n${state.cwd} # `
        );
        return;

      // backspace
      case 8:
        // Do not delete the prompt
        // @ts-ignore
        if (terminal._core.buffer.x > 2) terminal.write('\b \b');
        return;

      default:
        if (printable) {
          terminal.write(key);
        }
    }
  }

  useEffect(() => {
    const terminalEl: HTMLElement | null = document.querySelector('#terminal');
    if (!terminalEl) return;
    terminal.open(terminalEl);
    terminal.write(`${state.cwd} # `);
    terminal.onKey(keyPressed);
  }, [terminal]);

  useEffect(() => {
    if (state.history.length === 0) return;
    const last = state.history[state.history.length - 1];
    terminal?.write(`${last}\r\n${state.cwd} # `);
  }, [state.history]);

  return <div id="terminal" />;
};

export default TerminalComponent;
