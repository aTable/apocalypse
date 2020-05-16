import React, { useEffect, useContext, useState } from 'react';
import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import TerminalContext from '../stores/TerminalContext';
import styles from '../css/main.scss';

const terminalOptions: ITerminalOptions = {
  cursorBlink: true,
};

const TerminalComponent = () => {
  const { state } = useContext(TerminalContext);
  const [terminal] = useState<Terminal>(new Terminal(terminalOptions));
  const [fit] = useState<FitAddon>(new FitAddon());

  function keyPressed({
    key,
    domEvent,
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
  function updateTerminalToWindow() {
    fit.fit();
  }

  useEffect(() => {
    terminal.loadAddon(fit);

    // TODO: initialize terminal as the page content may be loading in variable height things i.e rendering graphs/charts, tabs
    setTimeout(updateTerminalToWindow, 0);
    setTimeout(updateTerminalToWindow, 1);
    setTimeout(updateTerminalToWindow, 10);
    setTimeout(updateTerminalToWindow, 30);
    setTimeout(updateTerminalToWindow, 50);
    setTimeout(updateTerminalToWindow, 70);
    setTimeout(updateTerminalToWindow, 90);
    setTimeout(updateTerminalToWindow, 100);
    setTimeout(updateTerminalToWindow, 300);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateTerminalToWindow);
  }, [updateTerminalToWindow]);

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

  return <div id="terminal" className={styles.terminal} />;
};

export default TerminalComponent;
